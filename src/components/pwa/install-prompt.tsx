"use client";

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const standalone = window.matchMedia("(display-mode: standalone)").matches;
    setIsInstalled(standalone);

    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    };
  }, []);

  if (isInstalled || dismissed || !deferredPrompt) {
    return null;
  }

  const handleInstall = async () => {
    await deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;
    if (result.outcome === "accepted") {
      setDeferredPrompt(null);
      setIsInstalled(true);
    }
  };

  return (
    <div className="fixed bottom-20 left-4 right-4 z-[70] rounded-xl border bg-background/95 p-4 shadow-lg backdrop-blur md:left-auto md:right-4 md:max-w-sm">
      <button
        type="button"
        aria-label="Kurulum kartını kapat"
        onClick={() => setDismissed(true)}
        className="absolute right-3 top-3 text-muted-foreground"
      >
        <X className="h-4 w-4" />
      </button>
      <div className="pr-6">
        <p className="text-sm font-semibold">Ana Ekrana Ekle</p>
        <p className="mt-1 text-sm text-muted-foreground">
          QuakeGuard&apos;ı uygulama olarak yukleyin ve deprem verilerine daha hizli erisin.
        </p>
      </div>
      <button
        type="button"
        onClick={handleInstall}
        className="mt-3 inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground"
      >
        <Download className="h-4 w-4" />
        Simdi Yukle
      </button>
    </div>
  );
}
