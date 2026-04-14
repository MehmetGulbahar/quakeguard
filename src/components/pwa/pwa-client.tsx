"use client";

import { useEffect, useState } from "react";
import { InstallPrompt } from "@/components/pwa/install-prompt";

export function PwaClient() {
  const [isOffline, setIsOffline] = useState(false);
  const [hasUpdate, setHasUpdate] = useState(false);
  const [syncMessage, setSyncMessage] = useState("");

  useEffect(() => {
    setIsOffline(!navigator.onLine);

    const onOnline = async () => {
      setIsOffline(false);
      if ("serviceWorker" in navigator) {
        const registration = await navigator.serviceWorker.ready;
        const syncManager = (registration as ServiceWorkerRegistration & {
          sync?: { register: (tag: string) => Promise<void> };
        }).sync;

        if (syncManager?.register) {
          await syncManager.register("sync-earthquakes");
        }
      }

      window.dispatchEvent(new CustomEvent("quakeguard-refetch"));
    };

    const onOffline = () => setIsOffline(true);

    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          if (registration.waiting) {
            setHasUpdate(true);
          }

          registration.addEventListener("updatefound", () => {
            const worker = registration.installing;
            if (!worker) {
              return;
            }

            worker.addEventListener("statechange", () => {
              if (worker.state === "installed" && navigator.serviceWorker.controller) {
                setHasUpdate(true);
              }
            });
          });

          const periodicSync = (registration as ServiceWorkerRegistration & {
            periodicSync?: { register: (tag: string, options?: { minInterval?: number }) => Promise<void> };
          }).periodicSync;

          if (periodicSync?.register) {
            periodicSync.register("periodic-earthquake-refresh", {
              minInterval: 15 * 60 * 1000,
            }).catch(() => undefined);
          }
        })
        .catch(() => {
          // SW registration failure should not break app rendering.
        });

      const onMessage = (event: MessageEvent<{ type?: string }>) => {
        if (event.data?.type === "EARTHQUAKE_SYNC_COMPLETED") {
          setSyncMessage("Deprem verileri baglanti geri geldiginde guncellendi.");
          window.dispatchEvent(new CustomEvent("quakeguard-refetch"));
          window.setTimeout(() => setSyncMessage(""), 5000);
        }
      };

      navigator.serviceWorker.addEventListener("message", onMessage);

      return () => {
        navigator.serviceWorker.removeEventListener("message", onMessage);
        window.removeEventListener("online", onOnline);
        window.removeEventListener("offline", onOffline);
      };
    }

    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  const reloadWithUpdate = async () => {
    if (!("serviceWorker" in navigator)) {
      return;
    }

    const registration = await navigator.serviceWorker.getRegistration();
    registration?.waiting?.postMessage({ type: "SKIP_WAITING" });
    window.location.reload();
  };

  return (
    <>
      {isOffline ? (
        <div className="fixed inset-x-0 top-0 z-[80] bg-amber-500 px-4 py-2 text-center text-sm font-medium text-black">
          Cevrimdisi moddasiniz. Son deprem verileri onbellekten gosteriliyor.
        </div>
      ) : null}

      {syncMessage ? (
        <div className="fixed inset-x-0 top-0 z-[80] bg-emerald-500 px-4 py-2 text-center text-sm font-medium text-black">
          {syncMessage}
        </div>
      ) : null}

      {hasUpdate ? (
        <div className="fixed bottom-4 left-4 right-4 z-[80] rounded-lg bg-background p-3 shadow-lg md:left-auto md:w-[360px]">
          <p className="text-sm font-medium">Yeni surum hazir</p>
          <p className="text-xs text-muted-foreground">Guncel deprem verileri icin uygulamayi yenileyin.</p>
          <button
            type="button"
            onClick={reloadWithUpdate}
            className="mt-2 rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground"
          >
            Simdi Guncelle
          </button>
        </div>
      ) : null}

      <InstallPrompt />
    </>
  );
}
