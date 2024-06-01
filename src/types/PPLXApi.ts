import { Collection } from '@/components/QueryBox/CollectionSelector';

export type UserSettingsApiResponse = {
  allow_article_creation: boolean;
  article_image_upload_limit: number;
  country: string;
  create_limit: number;
  default_copilot: boolean;
  default_image_generation_model: string;
  default_model: string;
  disable_training: boolean;
  email_status: string;
  gpt4_limit: number;
  has_ai_profile: boolean;
  has_data_retention_warning: boolean;
  is_priority: boolean;
  is_sidebar_collapsed: null | boolean;
  is_try_with_x_banner_dismissed: null | boolean;
  notif_status: string;
  opus_limit: number;
  query_count: number;
  query_count_copilot: number;
  referral_code: string;
  referral_num_coupons: number;
  referral_num_success: number;
  revenuecat_source: string;
  revenuecat_status: string;
  stripe_status: string;
  subscription_source: string;
  subscription_status: string;
  subscription_tier: string;
  upload_limit: number;
};

export type CollectionsAPIResponse = {
  title: string;
  uuid: string;
  instructions: string;
  slug: string;
  description: string;
  access: 1 | 2;
}[];

export type ThreadInfoAPIResponse = {
  text: string;
  backend_uuid: string;
  author_image: string;
  author_username: string;
  collection_info: Collection;
  thread_url_slug: string;
}