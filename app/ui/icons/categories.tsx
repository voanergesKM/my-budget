import {
  BadgeDollarSign,
  BanknoteArrowDown,
  Car,
  CatIcon,
  DollarSign,
  FilmIcon,
  GiftIcon,
  GraduationCap,
  HandCoins,
  Handshake,
  HeartHandshake,
  HeartPlusIcon,
  HelpCircle,
  PiggyBankIcon,
  Podcast,
  ShoppingCart,
  Utensils,
  UtilityPole,
  WalletCards,
} from "lucide-react";

export const categoryIcons = {
  food: Utensils,
  transport: Car,
  health: HeartPlusIcon,
  entertainment: FilmIcon,
  utilities: UtilityPole,
  shopping: ShoppingCart,
  travel: Car,
  education: GraduationCap,
  subscription: Podcast,
  family: HeartHandshake,
  pet: CatIcon,
  gift: GiftIcon,

  salary: HandCoins,
  freelance: DollarSign,
  investments: PiggyBankIcon,
  refund: WalletCards,
  rental: BanknoteArrowDown,
  business: Handshake,
  bonus: BadgeDollarSign,

  other: HelpCircle,
} as const;

export type CategoryIconKey = keyof typeof categoryIcons;
