import bcrypt from 'bcryptjs';

export async function seedDatabase() {
  console.log('[Seed] Seeding database with sovereign boutique catalog...');

  const adminPasswordHash = await bcrypt.hash('AdminPass123!', 12);
  const clientPasswordHash = await bcrypt.hash('ClientPass123!', 12);

  const adminUser = {
    id: 'usr-admin-1',
    name: 'Maison Master Admin',
    email: 'admin@aurelia.com',
    passwordHash: adminPasswordHash,
    role: 'admin',
    emailVerifiedAt: new Date(),
  };

  const clientUser = {
    id: 'usr-cust-1',
    name: 'Lady Genevieve Vance',
    email: 'genevieve.vance@luxurymail.com',
    passwordHash: clientPasswordHash,
    role: 'customer',
    emailVerifiedAt: new Date(),
  };

  console.log('[Seed] Users initialized:', adminUser.email, clientUser.email);
  console.log('[Seed] Database seeding completed successfully.');
}

if (require.main === module) {
  seedDatabase().catch((err) => {
    console.error('[Seed Error]', err);
    process.exit(1);
  });
}
