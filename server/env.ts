/**
 * Environment variable validation
 * Ensures all required environment variables are set before the app starts
 */

export function validateEnv() {
  const requiredEnvVars = [
    "MONGODB_URI",
    "NODE_ENV",
  ];

  const optionalEnvVars = [
    "GITHUB_CLIENT_SECRET",
    "GOOGLE_CLIENT_SECRET",
    "VITE_GITHUB_CLIENT_ID",
    "VITE_GOOGLE_CLIENT_ID",
  ];

  const missing: string[] = [];

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      missing.push(envVar);
    }
  }

  if (missing.length > 0) {
    console.error("❌ Missing required environment variables:");
    missing.forEach((envVar) => {
      console.error(`   - ${envVar}`);
    });
    process.exit(1);
  }

  // Log optional variables status
  const missingOptional = optionalEnvVars.filter(
    (envVar) => !process.env[envVar]
  );

  if (missingOptional.length > 0) {
    console.warn("⚠️  Missing optional environment variables:");
    missingOptional.forEach((envVar) => {
      console.warn(`   - ${envVar} (OAuth may not work)`);
    });
  }

  console.log("✅ Environment variables validated successfully");
}
