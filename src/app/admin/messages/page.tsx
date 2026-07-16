"use client";

import { useEffect, useState } from "react";
import { Mail, MailOpen, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { ContactMessage } from "@/lib/types";

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const fetchMessages = async () => {
    const supabase = createClient();
    const { data } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
    setMessages((data || []) as unknown as ContactMessage[]);
    setLoading(false);
  };

  useEffect(() => { fetchMessages(); }, []);

  const markAsRead = async (id: string) => {
    const supabase = createClient();
    await supabase.from("contact_messages").update({ is_read: true }).eq("id", id);
    setMessages((prev) => prev.map((m) => m.id === id ? { ...m, is_read: true } : m));
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer ce message ?")) return;
    const supabase = createClient();
    await supabase.from("contact_messages").delete().eq("id", id);
    setMessages((prev) => prev.filter((m) => m.id !== id));
  };

  const selectedMessage = messages.find((m) => m.id === selectedId);

  if (loading) {
    return <div className="animate-pulse space-y-4">{[1, 2, 3].map((i) => <div key={i} className="h-16 bg-dark-100 rounded" />)}</div>;
  }

  return (
    <div className="space-y-6">
      <p className="text-dark-500 text-sm">
        {messages.length} message(s) — {messages.filter((m) => !m.is_read).length} non lu(s)
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-1 space-y-2">
          {messages.map((msg) => (
            <button
              key={msg.id}
              onClick={() => {
                setSelectedId(msg.id);
                if (!msg.is_read) markAsRead(msg.id);
              }}
              className={`w-full text-left p-4 rounded-xl border transition-all ${
                selectedId === msg.id
                  ? "border-gold bg-dark-50"
                  : msg.is_read
                  ? "border-dark-200 bg-dark-50/50 hover:bg-dark-50"
                  : "border-gold/30 bg-dark-50 hover:bg-dark-50"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                {msg.is_read ? (
                  <MailOpen className="w-4 h-4 text-dark-500" />
                ) : (
                  <Mail className="w-4 h-4 text-gold" />
                )}
                <span className="text-sm text-white font-medium">{msg.nom}</span>
                {!msg.is_read && <div className="w-2 h-2 rounded-full bg-gold" />}
              </div>
              <p className="text-xs text-dark-500 truncate">{msg.message}</p>
              <p className="text-xs text-dark-400 mt-1">
                {new Date(msg.created_at).toLocaleDateString("fr-FR")}
              </p>
            </button>
          ))}
          {messages.length === 0 && (
            <p className="text-center text-dark-500 py-8">Aucun message</p>
          )}
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-2">
          {selectedMessage ? (
            <div className="p-6 rounded-xl border border-dark-200 bg-dark-50">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-heading text-white">{selectedMessage.nom}</h3>
                  <p className="text-sm text-dark-500">{selectedMessage.email}</p>
                  <p className="text-xs text-dark-400">
                    {new Date(selectedMessage.created_at).toLocaleString("fr-FR")}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(selectedMessage.id)}
                  className="p-2 text-dark-500 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="p-4 rounded-lg bg-dark border border-dark-200">
                <p className="text-white text-sm leading-relaxed whitespace-pre-wrap">
                  {selectedMessage.message}
                </p>
              </div>
              <a
                href={`mailto:${selectedMessage.email}?subject=Re: Votre message - Maison Nif Chrif`}
                className="inline-block mt-4 text-sm text-gold hover:underline"
              >
                Répondre par email →
              </a>
            </div>
          ) : (
            <div className="p-12 rounded-xl border border-dark-200 bg-dark-50 text-center text-dark-500">
              Sélectionnez un message pour le lire
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
