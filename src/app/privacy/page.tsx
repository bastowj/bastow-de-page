import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy / Datenschutzerklärung",
  description: "Information about how we handle your data",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Privacy Policy / Datenschutzerklärung</h1>
      
      <div className="space-y-12">
        {/* German Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Datenschutzerklärung (Deutsch)</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-medium mb-2">1. Datenschutz auf einen Blick</h3>
              <p className="mb-4">
                Diese Datenschutzerklärung klärt Sie über die Art, den Umfang und Zweck der Verarbeitung von personenbezogenen Daten innerhalb unseres Onlineangebotes auf.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-medium mb-2">2. Verantwortlicher</h3>
              <p className="mb-4">
                Julian Bastow<br />
                Musterstraße 123<br />
                12345 Musterstadt<br />
                Deutschland<br />
                E-Mail: contact@bastow.de<br />
                Telefon: +49 123 456789
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-medium mb-2">3. Arten der verarbeiteten Daten</h3>
              <ul className="list-disc pl-5 mb-4 space-y-1">
                <li>Bestandsdaten (z.B. Namen, Adressen)</li>
                <li>Kontaktdaten (z.B. E-Mail, Telefonnummern)</li>
                <li>Inhaltsdaten (z.B. Texteingaben, Fotografien, Videos)</li>
                <li>Nutzungsdaten (z.B. besuchte Webseiten, Interesse an Inhalten, Zugriffszeiten)</li>
                <li>Meta-/Kommunikationsdaten (z.B. Geräte-Informationen, IP-Adressen)</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-medium mb-2">4. Zweck der Verarbeitung</h3>
              <ul className="list-disc pl-5 mb-4 space-y-1">
                <li>Zurverfügungstellung des Onlineangebotes, seiner Funktionen und Inhalte</li>
                <li>Beantwortung von Kontaktanfragen und Kommunikation mit Nutzern</li>
                <li>Sicherheitsmaßnahmen</li>
                <li>Reichweitenmessung/Marketing</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-medium mb-2">5. Cookies</h3>
              <p className="mb-4">
                Diese Webseite verwendet Cookies. Cookies sind kleine Textdateien, die auf Ihrem Rechner abgelegt werden und die Ihr Browser speichert. Sie dienen dazu, unser Angebot nutzerfreundlicher, effektiver und sicherer zu machen.
              </p>
              <p className="mb-4">
                Sie können Ihren Browser so einstellen, dass Sie über das Setzen von Cookies informiert werden und Cookies nur im Einzelfall erlauben, die Annahme von Cookies für bestimmte Fälle oder generell ausschließen sowie das automatische Löschen der Cookies beim Schließen des Browsers aktivieren.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-medium mb-2">6. Rechte der betroffenen Personen</h3>
              <p className="mb-2">Sie haben das Recht:</p>
              <ul className="list-disc pl-5 mb-4 space-y-1">
                <li>gemäß Art. 15 DSGVO Auskunft über Ihre von uns verarbeiteten personenbezogenen Daten zu verlangen</li>
                <li>gemäß Art. 16 DSGVO die Berichtigung unrichtiger oder Vervollständigung Ihrer bei uns gespeicherten personenbezogenen Daten zu verlangen</li>
                <li>gemäß Art. 17 DSGVO die Löschung Ihrer bei uns gespeicherten personenbezogenen Daten zu verlangen</li>
                <li>gemäß Art. 18 DSGVO die Einschränkung der Verarbeitung Ihrer personenbezogenen Daten zu verlangen</li>
                <li>gemäß Art. 20 DSGVO Ihre personenbezogenen Daten, die Sie uns bereitgestellt haben, in einem strukturierten, gängigen und maschinenlesbaren Format zu erhalten oder die Übermittlung an einen anderen Verantwortlichen zu verlangen</li>
                <li>gemäß Art. 21 DSGVO Widerspruch gegen die Verarbeitung Ihrer personenbezogenen Daten einzulegen</li>
                <li>gemäß Art. 77 DSGVO sich bei einer Aufsichtsbehörde zu beschweren</li>
              </ul>
            </div>
          </div>
        </section>
        
        {/* English Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Privacy Policy (English)</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-medium mb-2">1. Privacy at a Glance</h3>
              <p className="mb-4">
                This privacy policy informs you about the nature, scope, and purpose of the processing of personal data within our online offering.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-medium mb-2">2. Responsible Party</h3>
              <p className="mb-4">
                Julian Bastow<br />
                Sample Street 123<br />
                12345 Sample City<br />
                Germany<br />
                Email: contact@bastow.de<br />
                Phone: +49 123 456789
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-medium mb-2">3. Types of Data Processed</h3>
              <ul className="list-disc pl-5 mb-4 space-y-1">
                <li>Inventory data (e.g., names, addresses)</li>
                <li>Contact data (e.g., email, phone numbers)</li>
                <li>Content data (e.g., text entries, photographs, videos)</li>
                <li>Usage data (e.g., websites visited, interest in content, access times)</li>
                <li>Meta/communication data (e.g., device information, IP addresses)</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-medium mb-2">4. Purpose of Processing</h3>
              <ul className="list-disc pl-5 mb-4 space-y-1">
                <li>Provision of the online offering, its functions, and contents</li>
                <li>Responding to contact requests and communicating with users</li>
                <li>Security measures</li>
                <li>Reach measurement/marketing</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-medium mb-2">5. Cookies</h3>
              <p className="mb-4">
                This website uses cookies. Cookies are small text files that are stored on your computer and saved by your browser. They are used to make our offering more user-friendly, effective, and secure.
              </p>
              <p className="mb-4">
                You can set your browser to inform you about the placement of cookies and to allow cookies only in individual cases, to exclude the acceptance of cookies for certain cases or in general, and to activate the automatic deletion of cookies when closing the browser.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-medium mb-2">6. Rights of the Data Subject</h3>
              <p className="mb-2">You have the right to:</p>
              <ul className="list-disc pl-5 mb-4 space-y-1">
                <li>request information about your personal data processed by us in accordance with Art. 15 GDPR</li>
                <li>request the correction of incorrect or completion of your personal data stored by us in accordance with Art. 16 GDPR</li>
                <li>request the deletion of your personal data stored by us in accordance with Art. 17 GDPR</li>
                <li>request the restriction of the processing of your personal data in accordance with Art. 18 GDPR</li>
                <li>receive your personal data that you have provided to us in a structured, common, and machine-readable format or to request the transfer to another controller in accordance with Art. 20 GDPR</li>
                <li>object to the processing of your personal data in accordance with Art. 21 GDPR</li>
                <li>lodge a complaint with a supervisory authority in accordance with Art. 77 GDPR</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}