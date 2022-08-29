export function checkEnvVars() {
  if(process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'development' && process.env.NODE_ENV !== 'test') {
    throw new Error('NODE_ENV must be set to production, development or test');
  }
}