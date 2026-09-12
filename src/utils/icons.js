/**
 * Centralized icon registry.
 *
 * Import icons ONLY from this file across the app. We deliberately use
 * specific named imports (never `import * as FaIcons`) because wildcard
 * imports pull the entire icon set into the bundle and cause severe bloat.
 *
 * Need a new icon? Add a single named import here and re-export it.
 */

// lucide-react
export {
  Phone,
  PhoneCall,
  Mail,
  MapPin,
  Clock,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  ArrowRight,
  ArrowUpRight,
  Star,
  Sparkles,
  Award,
  ShieldCheck,
  Globe,
  Video,
  Play,
  Pause,
  Volume2,
  VolumeX,
  CheckCircle2,
  Check,
  Quote,
  Sun,
  Moon,
  Flame,
  Gem,
  HandHeart,
  HeartHandshake,
  Heart,
  Brain,
  Briefcase,
  Compass,
  Scale,
  GraduationCap,
  Plane,
  Users,
  Coins,
  TrendingUp,
  Landmark,
  Activity,
  BookOpen,
  CalendarDays,
  Hand,
  Infinity,
  Stars,
} from 'lucide-react';

// react-icons (subset — specific imports only)
export {
  FaWhatsapp,
  FaInstagram,
  FaFacebookF,
  FaYoutube,
  FaTelegramPlane,
} from 'react-icons/fa';

export { SiZoom, SiGooglemeet } from 'react-icons/si';
