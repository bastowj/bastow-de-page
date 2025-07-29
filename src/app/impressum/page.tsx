import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Impressum / Imprint",
  description: "Legal information about this website",
};

export default function ImpressumPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Impressum / Imprint</h1>
      
      <div className="space-y-12">
        {/* German Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Impressum (Deutsch)</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-medium mb-2">Angaben gemäß § 5 TMG</h3>
              <p>Julian Bastow</p>
              <p>Musterstraße 123</p>
              <p>12345 Musterstadt</p>
              <p>Deutschland</p>
            </div>
            
            <div>
              <h3 className="text-xl font-medium mb-2">Kontakt</h3>
              <p>E-Mail: contact@bastow.de</p>
              <p>Telefon: +49 123 456789</p>
            </div>
            
            <div>
              <h3 className="text-xl font-medium mb-2">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h3>
              <p>Julian Bastow</p>
              <p>Musterstraße 123</p>
              <p>12345 Musterstadt</p>
              <p>Deutschland</p>
            </div>
            
            <div>
              <h3 className="text-xl font-medium mb-2">Haftungsausschluss</h3>
              <p className="mb-2">
                <strong>Haftung für Inhalte</strong>
              </p>
              <p className="mb-4">
                Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen.
              </p>
              
              <p className="mb-2">
                <strong>Haftung für Links</strong>
              </p>
              <p>
                Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen.
              </p>
            </div>
          </div>
        </section>
        
        {/* English Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Imprint (English)</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-medium mb-2">Information according to § 5 TMG</h3>
              <p>Julian Bastow</p>
              <p>Sample Street 123</p>
              <p>12345 Sample City</p>
              <p>Germany</p>
            </div>
            
            <div>
              <h3 className="text-xl font-medium mb-2">Contact</h3>
              <p>Email: contact@bastow.de</p>
              <p>Phone: +49 123 456789</p>
            </div>
            
            <div>
              <h3 className="text-xl font-medium mb-2">Responsible for content according to § 55 para. 2 RStV</h3>
              <p>Julian Bastow</p>
              <p>Sample Street 123</p>
              <p>12345 Sample City</p>
              <p>Germany</p>
            </div>
            
            <div>
              <h3 className="text-xl font-medium mb-2">Disclaimer</h3>
              <p className="mb-2">
                <strong>Liability for Content</strong>
              </p>
              <p className="mb-4">
                The contents of our pages were created with the utmost care. However, we cannot guarantee the accuracy, completeness, and timeliness of the content.
              </p>
              
              <p className="mb-2">
                <strong>Liability for Links</strong>
              </p>
              <p>
                Our offer contains links to external websites of third parties, the content of which we have no influence on. Therefore, we cannot assume any liability for these external contents.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}