export const paths = {
  home: '/',
  auth: { signIn: '/auth/sign-in' },
  dashboard: {
    overview: '/dashboard',
    students: '/dashboard/students',
    trainers: '/dashboard/trainers',
    jobs: '/dashboard/jobs',
    schools: '/dashboard/schools',
    integrations: '/dashboard/integrations',
  },
  errors: { notFound: '/errors/not-found' },
} as const;
