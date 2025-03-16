export interface Rule {
  title: string;
  site_regexp: string;
  example_url: string;
  specify_url_by_regexp: boolean;
  search_block_xpath: string;
  search_block_css: string;
  search_block_by_css: boolean;
  hide_block_xpath: string;
  hide_block_css: string;
  hide_block_by_css: boolean;
  is_disabled: boolean;
  user_identifier: string | null;
  global_identifier: string | null;
  insert_date: number;
  update_date: number;
  delete_date: number;
}

export interface Site {
  name: string;
  url?: string;
  rules: Rule[];
}

export interface RuleWrapper {
  label: string;
  rule: Rule;
  isChecked: boolean;
  isAlreadyImported: boolean;
}

export interface SiteWrapper {
  site: Site;
  ruleWrappers: RuleWrapper[];
  isOpen: boolean;
  isDisabled: boolean;
} 