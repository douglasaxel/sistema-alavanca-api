import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
	const user = prisma.user.upsert({
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

	const customers = prisma.customer.createMany({
		data: [
			{
				id: 1,
				image: 'https://thefixt.com/user-default.jpeg',
				name: 'Cliente 1',
				phone: '(51) 99495-1111',
				email: 'cliente1@gmail.com',
				cnpj: '62.961.121/0001-57',
				accountable: 'Responsável 1',
				createdAt: '2023-07-26 19:36:01.147',
				updatedAt: '2023-07-26 19:36:01.147',
				deletedAt: null,
			},
			{
				id: 2,
				image: 'https://thefixt.com/user-default.jpeg',
				name: 'Cliente 2',
				phone: '(51) 99495-2222',
				email: 'cliente2@gmail.com',
				cnpj: '62.109.579/0001-82',
				accountable: 'Responsável 2',
				createdAt: '2023-07-26 19:36:49.855',
				updatedAt: '2023-07-26 19:36:49.855',
				deletedAt: null,
			},
		],
	});

	await prisma.$transaction([user, customers]);
	console.log({ user, customers });
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
