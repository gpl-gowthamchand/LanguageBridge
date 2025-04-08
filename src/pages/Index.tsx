
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Translator from "@/components/Translator";
import { MAX_TEXT_LENGTH } from "@/services/translation-service";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/50 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        <Card className="border-none shadow-lg">
          <CardHeader className="text-center bg-gradient-to-r from-translator-primary to-translator-secondary text-white rounded-t-lg">
            <CardTitle className="text-3xl font-bold"> 🌐 LanguageBridge </CardTitle>
            <CardDescription className="text-white/80">
            Powered by mBART-large-50 — translate effortlessly across languages
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 h-[calc(100vh-220px)]">
            <Translator />
          </CardContent>
        </Card>
      </div>
      <footer className="text-center text-muted-foreground text-sm mt-8">
        <p>Connecting people around the world with advanced AI translation technology</p>
      </footer>
    </div>
  );
};

export default Index;
