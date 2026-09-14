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
  'w-full rounded-xl border border-navy-900/30 bg-navy-900/[0.07] px-4 py-3 text-navy-900 placeholder:text-navy-900/40 outline-none transition focus:border-coral/60 focus:bg-navy-900/[0.12] focus:ring-1 focus:ring-coral/30';

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
                  <CheckCircle2 className="h-14 w-14 text-coral" />
                  <h3 className="font-display text-2xl font-semibold text-navy-900">
                    Thank You 🙏
                  </h3>
                  <p className="max-w-sm text-sm text-navy-900/60">
                    Your details have opened in WhatsApp — just press send and we'll
                    confirm your consultation shortly.
                  </p>
                  <button
                    onClick={() => setSent(false)}
                    className="mt-2 text-sm text-coral underline-offset-4 hover:underline"
                  >
                    Send another enquiry
                  </button>
                </div>
              ) : (
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm text-navy-900/70">Name *</label>
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
                    <label className="mb-1.5 block text-sm text-navy-900/70">Phone *</label>
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
                    <label className="mb-1.5 block text-sm text-navy-900/70">
                      Date of Birth
                    </label>
                    <input type="date" className={`${fieldBase} [color-scheme:light]`} {...register('dob')} />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm text-navy-900/70">
                      Service Required *
                    </label>
                    <select
                      className={fieldBase}
                      defaultValue=""
                      {...register('service', { required: 'Please select a service' })}
                    >
                      <option value="" disabled className="bg-white">
                        Select a service
                      </option>
                      {services.map((s) => (
                        <option key={s.title} value={s.title} className="bg-white">
                          {s.title}
                        </option>
                      ))}
                      <option value="Poojas & Homas" className="bg-white">
                        Poojas & Homas
                      </option>
                      <option value="Energized Yantras" className="bg-white">
                        Energized Yantras
                      </option>
                    </select>
                    {errors.service && (
                      <p className="mt-1 text-xs text-red-300">{errors.service.message}</p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-sm text-navy-900/70">
                      Preferred Consultation Mode *
                    </label>
                    <select
                      className={fieldBase}
                      defaultValue=""
                      {...register('mode', { required: 'Please choose a mode' })}
                    >
                      <option value="" disabled className="bg-white">
                        Select a mode
                      </option>
                      {modes.map((m) => (
                        <option key={m} value={m} className="bg-white">
                          {m}
                        </option>
                      ))}
                    </select>
                    {errors.mode && (
                      <p className="mt-1 text-xs text-red-300">{errors.mode.message}</p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-sm text-navy-900/70">Message</label>
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
                      variant="coral"
                      size="lg"
                      icon={FaWhatsapp}
                      iconRight={false}
                      className="w-full"
                    >
                      Book Consultation
                    </Button>
                    <p className="mt-3 text-center text-xs text-navy-900/40">
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
            <GlassCard coral glow={false} className="p-7">
              <h3 className="font-display text-xl font-semibold text-navy-900">
                Reach Us Directly
              </h3>
              <span className="mt-3 block h-px w-12 bg-coral/50" />

              <ul className="mt-6 space-y-5 text-sm">
                <li className="flex items-start gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-coral/30 bg-coral/[0.08] text-coral">
                    <Icon name="MapPin" className="h-5 w-5" />
                  </span>
                  <span className="text-navy-900/70">
                    {site.location.name}
                    <br />
                    {site.location.address}
                    <br />
                    {site.location.city} - {site.location.pincode}, India
                  </span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-coral/30 bg-coral/[0.08] text-coral">
                    <Icon name="Phone" className="h-5 w-5" />
                  </span>
                  <span className="flex flex-col text-navy-900/70">
                    {site.phones.map((p) => (
                      <a key={p} href={telLink(primaryPhoneDigits)} className="transition hover:text-coral">
                        {p}
                      </a>
                    ))}
                  </span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-coral/30 bg-coral/[0.08] text-coral">
                    <Icon name="Mail" className="h-5 w-5" />
                  </span>
                  <span className="flex flex-col text-navy-900/70">
                    {site.emails.map((e) => (
                      <a key={e} href={mailLink(e)} className="transition hover:text-coral">
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
              className="group flex items-center justify-between gap-4 rounded-2xl border border-coral/30 bg-coral/[0.06] p-6 transition-all duration-500 hover:bg-coral/[0.12] hover:shadow-glow"
            >
              <div>
                <p className="font-display text-lg font-semibold text-navy-900">
                  Chat on WhatsApp
                </p>
                <p className="text-sm text-navy-900/60">Fastest way to reach us</p>
              </div>
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-coral-gradient text-navy-950 transition-transform duration-500 group-hover:scale-110">
                <FaWhatsapp className="h-6 w-6" />
              </span>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
