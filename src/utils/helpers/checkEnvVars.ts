export function checkEnvVars() {
  if(process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'development' && process.env.NODE_ENV !== 'test') {
    throw new Error('NODE_ENV must be set to production, development or test');
  } else if(!process.env.NEXT_PUBLIC_URL) {
    throw new Error('NEXT_PUBLIC_URL must be set');
  } else if(!process.env.NEXT_PUBLIC_API_URL) {
    throw new Error('NEXT_PUBLIC_API_URL must be set');
  } else if(!process.env.NEXT_PUBLIC_BUCKET_URL) {
    throw new Error('NEXT_PUBLIC_BUCKET_URL must be set');
  } else if(!process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY) {
    throw new Error('NEXT_PUBLIC_STRIPE_PUBLIC_KEY must be set');
  }
}