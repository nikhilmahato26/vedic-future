import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import SectionTitle from '../ui/SectionTitle';
import GlassCard from '../ui/GlassCard';
import Button from '../ui/Button';
import Icon from '../ui/Icon';
import { fadeUp, viewport } from '../../utils/motion';
import {
  site,
  telLink,
  mailLink,
  whatsappLink,
  primaryPhoneDigits,
  secondaryPhoneDigits,
} from '../../data/site';
import { services } from '../../data/services';
import { FaWhatsapp, CheckCircle2 } from '../../utils/icons';

const modes = [
  'In-Person (Delhi)',
  'WhatsApp',
  'Video Call',
  'Zoom',
  'Google Meet',
];

const fieldBase =
  'w-full rounded-xl border border-ivory/30 bg-ivory/[0.07] px-4 py-3 text-ivory placeholder:text-ivory/40 outline-none transition focus:border-gold/60 focus:bg-ivory/[0.12] focus:ring-1 focus:ring-gold/30';

export default function Contact() {
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    const message =
      `Namaste 🙏 I would like to book a consultation.\n\n` +
      `Name: ${data.name}\n` +
      `Phone: ${data.phone}\n` +
      `Date of Birth: ${data.dob || '—'}\n` +
      `Service Required: ${data.service}\n` +
      `Preferred Mode: ${data.mode}\n` +
      `Message: ${data.message || '—'}`;
    window.open(whatsappLink(message), '_blank', 'noopener,noreferrer');
    setSent(true);
  };

  return (
    <section id="contact" className="section-pad relative">
      <div className="container-luxe">
        <SectionTitle
          eyebrow="Get in Touch"
          title="Book Your Consultation"
          subtitle="Share a few details and we'll connect with you to confirm a time. Your information remains completely confidential."
        />

        <div className="mt-14 grid gap-8 lg:grid-cols-5">
          {/* Form */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={viewport}
            className="lg:col-span-3"
          >
            <GlassCard glow={false} className="p-7 sm:p-9">
              {sent ? (
                <div className="flex flex-col items-center justify-center gap-4 py-14 text-center">
                  <CheckCircle2 className="h-14 w-14 text-gold" />
                  <h3 className="font-display text-2xl font-semibold text-ivory">
                    Thank You 🙏
                  </h3>
                  <p className="max-w-sm text-sm text-ivory/60">
                    Your details have opened in WhatsApp — just press send and we'll
                    confirm your consultation shortly.
                  </p>
                  <button
                    onClick={() => setSent(false)}
                    className="mt-2 text-sm text-gold underline-offset-4 hover:underline"
                  >
                    Send another enquiry
                  </button>
                </div>
              ) : (
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm text-ivory/70">Name *</label>
                    <input
                      type="text"
                      placeholder="Your full name"
                      className={fieldBase}
                      {...register('name', { required: 'Name is required' })}
                    />
                    {errors.name && (
                      <p className="mt-1 text-xs text-red-300">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm text-ivory/70">Phone *</label>
                    <input
                      type="tel"
                      placeholder="+91 ..."
                      className={fieldBase}
                      {...register('phone', {
                        required: 'Phone is required',
                        minLength: { value: 7, message: 'Enter a valid number' },
                      })}
                    />
                    {errors.phone && (
                      <p className="mt-1 text-xs text-red-300">{errors.phone.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm text-ivory/70">
                      Date of Birth
                    </label>
                    <input type="date" className={`${fieldBase} [color-scheme:light]`} {...register('dob')} />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm text-ivory/70">
                      Service Required *
                    </label>
                    <select
                      className={fieldBase}
                      defaultValue=""
                      {...register('service', { required: 'Please select a service' })}
                    >
                      <option value="" disabled className="bg-cosmic-900">
                        Select a service
                      </option>
                      {services.map((s) => (
                        <option key={s.title} value={s.title} className="bg-cosmic-900">
                          {s.title}
                        </option>
                      ))}
                      <option value="Poojas & Homas" className="bg-cosmic-900">
                        Poojas & Homas
                      </option>
                      <option value="Energized Yantras" className="bg-cosmic-900">
                        Energized Yantras
                      </option>
                    </select>
                    {errors.service && (
                      <p className="mt-1 text-xs text-red-300">{errors.service.message}</p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-sm text-ivory/70">
                      Preferred Consultation Mode *
                    </label>
                    <select
                      className={fieldBase}
                      defaultValue=""
                      {...register('mode', { required: 'Please choose a mode' })}
                    >
                      <option value="" disabled className="bg-cosmic-900">
                        Select a mode
                      </option>
                      {modes.map((m) => (
                        <option key={m} value={m} className="bg-cosmic-900">
                          {m}
                        </option>
                      ))}
                    </select>
                    {errors.mode && (
                      <p className="mt-1 text-xs text-red-300">{errors.mode.message}</p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-sm text-ivory/70">Message</label>
                    <textarea
                      rows={4}
                      placeholder="Tell us briefly what guidance you're seeking..."
                      className={`${fieldBase} resize-none`}
                      {...register('message')}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <Button
                      type="button"
                      onClick={handleSubmit(onSubmit)}
                      variant="gold"
                      size="lg"
                      icon={FaWhatsapp}
                      iconRight={false}
                      className="w-full"
                    >
                      Book Consultation
                    </Button>
                    <p className="mt-3 text-center text-xs text-ivory/40">
                      Submitting opens WhatsApp with your details pre-filled.
                    </p>
                  </div>
                </div>
              )}
            </GlassCard>
          </motion.div>

          {/* Contact details */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={viewport}
            className="flex flex-col gap-5 lg:col-span-2"
          >
            <GlassCard gold glow={false} className="p-7">
              <h3 className="font-display text-xl font-semibold text-ivory">
                Reach Us Directly
              </h3>
              <span className="mt-3 block h-px w-12 bg-gold/50" />

              <ul className="mt-6 space-y-5 text-sm">
                <li className="flex items-start gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/30 bg-gold/[0.08] text-gold">
                    <Icon name="MapPin" className="h-5 w-5" />
                  </span>
                  <span className="text-ivory/70">
                    {site.location.name}
                    <br />
                    {site.location.address}
                    <br />
                    {site.location.city} - {site.location.pincode}, India
                  </span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/30 bg-gold/[0.08] text-gold">
                    <Icon name="Phone" className="h-5 w-5" />
                  </span>
                  <span className="flex flex-col text-ivory/70">
                    {site.phones.map((p) => (
                      <a key={p} href={telLink(primaryPhoneDigits)} className="transition hover:text-gold">
                        {p}
                      </a>
                    ))}
                  </span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/30 bg-gold/[0.08] text-gold">
                    <Icon name="Mail" className="h-5 w-5" />
                  </span>
                  <span className="flex flex-col text-ivory/70">
                    {site.emails.map((e) => (
                      <a key={e} href={mailLink(e)} className="transition hover:text-gold">
                        {e}
                      </a>
                    ))}
                  </span>
                </li>
              </ul>
            </GlassCard>

            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between gap-4 rounded-2xl border border-gold/30 bg-gold/[0.06] p-6 transition-all duration-500 hover:bg-gold/[0.12] hover:shadow-glow"
            >
              <div>
                <p className="font-display text-lg font-semibold text-ivory">
                  Chat on WhatsApp
                </p>
                <p className="text-sm text-ivory/60">Fastest way to reach us</p>
              </div>
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-gradient text-cosmic-950 transition-transform duration-500 group-hover:scale-110">
                <FaWhatsapp className="h-6 w-6" />
              </span>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
