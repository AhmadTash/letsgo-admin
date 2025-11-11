import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems = [
  { key: 'overview', title: 'Overview', href: paths.dashboard.overview, icon: 'chart-pie' },
  { key: 'students', title: 'Students', href: paths.dashboard.students, icon: 'users' },
  { key: 'trainers', title: 'Trainers', href: paths.dashboard.trainers, icon: 'users' },
  { key: 'jobs', title: 'Jobs', href: paths.dashboard.jobs, icon: 'briefcase' },
  { key: 'schools', title: 'Schools', href: paths.dashboard.schools, icon: 'school' },
  // { key: 'integrations', title: 'Integrations', href: paths.dashboard.integrations, icon: 'plugs-connected' },
  // { key: 'settings', title: 'Settings', href: paths.dashboard.settings, icon: 'gear-six' },
  // { key: 'account', title: 'Account', href: paths.dashboard.account, icon: 'user' },
  // { key: 'error', title: 'Error', href: paths.errors.notFound, icon: 'x-square' },
] satisfies NavItemConfig[];
