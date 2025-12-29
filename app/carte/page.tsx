import { AppLayout } from "@/components/app-layout"

export default function CartePage() {
  return (
    <AppLayout>
      <div className="h-full flex flex-col">
        <div className="border-b bg-card px-8 py-6">
          <h1 className="text-3xl font-bold text-foreground">Carte</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Vue géographique des interventions en Île-de-France
          </p>
          
          <div className="mt-4 flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 rounded border-input accent-primary"
              />
              <span className="text-sm text-foreground">Techniciens</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 rounded border-input accent-primary"
              />
              <span className="text-sm text-foreground">Clients</span>
            </label>
          </div>
        </div>

        <div className="flex-1 relative">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d668268.0371827712!2d1.9305993!3d48.8566!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66e1f06e2b005%3A0x40b82c3688c9460!2s%C3%8Ele-de-France!5e0!3m2!1sfr!2sfr!4v1234567890"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Carte Île-de-France"
          />
        </div>
      </div>
    </AppLayout>
  )
}
