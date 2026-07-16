"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Save, CheckCircle } from "lucide-react";

export default function AdminParametresPage() {
  const [siteName, setSiteName] = useState("Maison Nif Chrif");
  const [siteEmail, setSiteEmail] = useState("contact@maisonnifchrif.com");
  const [sitePhone, setSitePhone] = useState("+212 6 00 00 00 00");
  const [siteAddress, setSiteAddress] = useState("Marrakech, Maroc");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // In a real app, this would save to a settings table in Supabase
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-2xl space-y-6">
      <h2 className="font-heading text-2xl text-white">Paramètres du Site</h2>

      <div className="p-6 rounded-xl border border-dark-200 bg-dark-50 space-y-6">
        <div>
          <label className="block text-sm text-dark-500 mb-1">Nom du site</label>
          <Input value={siteName} onChange={(e) => setSiteName(e.target.value)} className="bg-dark" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-dark-500 mb-1">Email</label>
            <Input type="email" value={siteEmail} onChange={(e) => setSiteEmail(e.target.value)} className="bg-dark" />
          </div>
          <div>
            <label className="block text-sm text-dark-500 mb-1">Téléphone</label>
            <Input value={sitePhone} onChange={(e) => setSitePhone(e.target.value)} className="bg-dark" />
          </div>
        </div>

        <div>
          <label className="block text-sm text-dark-500 mb-1">Adresse</label>
          <Textarea value={siteAddress} onChange={(e) => setSiteAddress(e.target.value)} rows={3} className="bg-dark" />
        </div>

        <div className="flex items-center gap-4">
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Sauvegarder
          </Button>
          {saved && (
            <div className="flex items-center gap-2 text-green-400 text-sm animate-fade-in-up">
              <CheckCircle className="w-4 h-4" />
              Sauvegardé !
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
