"use client";

import { useState } from "react";
import { Bell, Send } from "lucide-react";
import { urlBase64ToUint8Array } from "@/lib/push-client";

export function PushControls() {
  const [isBusy, setIsBusy] = useState(false);
  const [message, setMessage] = useState("");

  const enablePush = async () => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      setMessage("Bu tarayici push bildirimlerini desteklemiyor.");
      return;
    }

    setIsBusy(true);
    setMessage("");

    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setMessage("Bildirim izni verilmedi.");
        return;
      }

      const registration = await navigator.serviceWorker.ready;
      const keyResponse = await fetch("/api/push/vapid-public-key", { cache: "no-store" });

      if (!keyResponse.ok) {
        setMessage("Push anahtari alinamadi.");
        return;
      }

      const { publicKey } = (await keyResponse.json()) as { publicKey: string };

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      });

      const subscribeResponse = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscription }),
      });

      if (!subscribeResponse.ok) {
        setMessage("Bildirim aboneligi kaydedilemedi.");
        return;
      }

      localStorage.setItem("quakeguard_push_subscription", JSON.stringify(subscription));
      setMessage("Deprem bildirimi aktif edildi.");
    } catch {
      setMessage("Push kurulumu sirasinda bir hata olustu.");
    } finally {
      setIsBusy(false);
    }
  };

  const sendTestNotification = async () => {
    const stored = localStorage.getItem("quakeguard_push_subscription");

    if (!stored) {
      setMessage("Once bildirimi aktif edin.");
      return;
    }

    setIsBusy(true);

    try {
      const response = await fetch("/api/push/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subscription: JSON.parse(stored),
          payload: {
            title: "Yeni deprem tespit edildi",
            body: "Izmir 4.2 - Son 5 dakika icinde kaydedildi.",
            url: "/list",
            tag: "earthquake-alert",
          },
        }),
      });

      setMessage(response.ok ? "Test bildirimi gonderildi." : "Test bildirimi gonderilemedi.");
    } catch {
      setMessage("Test bildirimi sirasinda bir hata olustu.");
    } finally {
      setIsBusy(false);
    }
  };

  const disablePush = async () => {
    const stored = localStorage.getItem("quakeguard_push_subscription");

    if (!stored) {
      setMessage("Aktif bildirim aboneligi bulunamadi.");
      return;
    }

    setIsBusy(true);

    try {
      const subscription = JSON.parse(stored);

      await fetch("/api/push/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscription }),
      });

      const registration = await navigator.serviceWorker.ready;
      const activeSubscription = await registration.pushManager.getSubscription();
      await activeSubscription?.unsubscribe();

      localStorage.removeItem("quakeguard_push_subscription");
      setMessage("Bildirim aboneligi kaldirildi.");
    } catch {
      setMessage("Bildirim kapatma sirasinda bir hata olustu.");
    } finally {
      setIsBusy(false);
    }
  };

  const broadcastAlert = async () => {
    setIsBusy(true);

    try {
      const response = await fetch("/api/push/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          payload: {
            title: "Acil deprem bildirimi",
            body: "Son 5 dakika icinde deprem kaydedildi.",
            url: "/list",
            tag: "earthquake-alert",
          },
        }),
      });

      if (!response.ok) {
        setMessage("Toplu bildirim gonderilemedi.");
        return;
      }

      const data = (await response.json()) as { sent: number };
      setMessage(`Toplu bildirim gonderildi: ${data.sent}`);
    } catch {
      setMessage("Toplu bildirim sirasinda bir hata olustu.");
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={enablePush}
        disabled={isBusy}
        className="inline-flex h-9 items-center gap-1 rounded-md border px-2 text-xs"
        title="Deprem bildirimlerini ac"
      >
        <Bell className="h-4 w-4" />
        Bildirim
      </button>
      <button
        type="button"
        onClick={sendTestNotification}
        disabled={isBusy}
        className="inline-flex h-9 items-center gap-1 rounded-md border px-2 text-xs"
        title="Test bildirimi gonder"
      >
        <Send className="h-4 w-4" />
        Test
      </button>
      <button
        type="button"
        onClick={broadcastAlert}
        disabled={isBusy}
        className="inline-flex h-9 items-center gap-1 rounded-md border px-2 text-xs"
        title="Tum abonelere acil bildirim gonder"
      >
        Acil
      </button>
      <button
        type="button"
        onClick={disablePush}
        disabled={isBusy}
        className="inline-flex h-9 items-center gap-1 rounded-md border px-2 text-xs"
        title="Bildirim aboneligini kapat"
      >
        Kapat
      </button>
      {message ? <span className="hidden text-xs text-muted-foreground lg:inline">{message}</span> : null}
    </div>
  );
}
