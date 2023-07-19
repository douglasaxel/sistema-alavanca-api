import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
	const user = await prisma.user.upsert({
		where: { email: 'douglasaxelkjellin@gmail.com' },
		update: {},
		create: {
			email: 'douglasaxelkjellin@gmail.com',
			name: 'Douglas Axel',
			password: '$2b$10$fj9OoAXxoUEIAtBbyXuDiuk.PjDNjeP4Kdx5Uy2Y0zCAJJyms8J66',
			image: 'https://thefixt.com/user-default.jpeg',
			role: 'ADMIN',
		},
	});
	console.log({ user });
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async e => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
