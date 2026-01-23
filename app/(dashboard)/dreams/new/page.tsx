import { Moon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DreamForm } from "@/components/dream/DreamForm";

export const metadata = {
  title: "Nouveau rêve",
};

export default function NewDreamPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <Card className="glass-card border-mystic-700/30">
        <CardHeader className="text-center border-b border-mystic-700/30">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full bg-mystic-800/50">
              <Moon className="w-10 h-10 text-mystic-400" />
            </div>
          </div>
          <CardTitle className="font-display text-2xl text-lunar">
            Enregistrer un nouveau rêve
          </CardTitle>
          <p className="text-mystic-400 mt-2">
            Décrivez votre rêve en détail pour obtenir une interprétation personnalisée
          </p>
        </CardHeader>
        <CardContent className="pt-8">
          <DreamForm />
        </CardContent>
      </Card>
    </div>
  );
}
