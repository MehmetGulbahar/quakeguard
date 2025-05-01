"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, ShieldCheck, Phone, HeartPulse, PackageSearch, Home, BadgeAlert } from "lucide-react"

const emergencyNumbers = [
  { name: "AFAD", number: "122" },
  { name: "Acil Çağrı", number: "112" },
  { name: "Polis", number: "155" },
  { name: "İtfaiye", number: "110" },
]

const beforeEarthquake = [
  "Evinizin depreme dayanıklılığını kontrol ettirin",
  "Acil durum çantası hazırlayın",
  "Aile afet planı oluşturun",
  "Eşyaları sabitleyin",
  "Toplanma alanlarını öğrenin",
  "Gaz, elektrik ve su vanalarının yerlerini öğrenin",
]

const duringEarthquake = [
  "Çök-Kapan-Tutun hareketini uygulayın",
  "Pencerelerden uzak durun",
  "Merdivenleri kullanmayın",
  "Asansöre binmeyin",
  "Bina içindeyseniz, dışarı çıkmaya çalışmayın",
]

const afterEarthquake = [
  "Sakin olun ve etrafınızı kontrol edin",
  "Yangın ve gaz kaçağı kontrolü yapın",
  "Yaralılara yardım edin",
  "Radyo ve televizyondan bilgi alın",
  "Hasarlı binalardan uzak durun",
  "Telefonu acil durumlar dışında kullanmayın",
]

export function EarthquakeInfo() {
  return (
    <div className="space-y-8">
      {/* Acil Durum Uyarısı */}
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Deprem Anında</AlertTitle>
        <AlertDescription>
          Panik yapmayın. Çök-Kapan-Tutun hareketini uygulayın ve tehlike geçene kadar güvenli bir noktada bekleyin.
        </AlertDescription>
      </Alert>

      {/* Acil Numaralar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-primary" />
            Acil Numaralar
          </CardTitle>
          <CardDescription>
            Bu numaraları kaydedin ve acil durumlarda kullanın
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {emergencyNumbers.map((item) => (
              <div
                key={item.number}
                className="p-4 rounded-lg border bg-card text-card-foreground hover:bg-accent transition-colors"
              >
                <p className="text-2xl font-bold text-primary">{item.number}</p>
                <p className="text-sm text-muted-foreground">{item.name}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Deprem Çantası */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PackageSearch className="h-5 w-5 text-primary" />
            Deprem Çantasında Bulunması Gerekenler
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg border">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <HeartPulse className="h-4 w-4 text-destructive" />
                Sağlık Malzemeleri
              </h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>İlk yardım çantası</li>
                <li>Reçeteli ilaçlar</li>
                <li>Dezenfektan</li>
                <li>Maske</li>
                <li>Islak mendil</li>
              </ul>
            </div>
            <div className="p-4 rounded-lg border">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Home className="h-4 w-4 text-primary" />
                Temel İhtiyaçlar
              </h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>Su (kişi başı 4 litre)</li>
                <li>Konserve yiyecekler</li>
                <li>El feneri ve yedek pil</li>
                <li>Powerbank</li>
                <li>Düdük</li>
              </ul>
            </div>
            <div className="p-4 rounded-lg border">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-accent" />
                Belgeler
              </h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>Kimlik fotokopileri</li>
                <li>Önemli telefon numaraları</li>
                <li>Banka kartı</li>
                <li>Nakit para</li>
                <li>Sigorta belgeleri</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Deprem Bilgilendirme Akordiyon */}
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="before">
          <AccordionTrigger>
            <span className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Deprem Öncesinde Yapılması Gerekenler
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <ul className="space-y-2 pl-6 list-disc text-muted-foreground">
              {beforeEarthquake.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="during">
          <AccordionTrigger>
            <span className="flex items-center gap-2">
              <BadgeAlert className="h-4 w-4 text-destructive" />
              Deprem Sırasında Yapılması Gerekenler
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <ul className="space-y-2 pl-6 list-disc text-muted-foreground">
              {duringEarthquake.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="after">
          <AccordionTrigger>
            <span className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-warning" />
              Deprem Sonrasında Yapılması Gerekenler
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <ul className="space-y-2 pl-6 list-disc text-muted-foreground">
              {afterEarthquake.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
} 