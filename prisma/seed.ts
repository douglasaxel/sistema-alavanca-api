import { PrismaClient } from '@prisma/client';
import { getNumbersFromString } from '../src/utils/string-helper';
import { dateAddOrSub } from '../src/utils/dateHelpers';
import { fakerPT_BR as faker } from '@faker-js/faker';
import { generate as generateCnpj } from '../src/lib/cnpj';

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
				image: faker.image.avatarGitHub(),
				name: faker.company.name(),
				phone: getNumbersFromString(faker.phone.number()),
				email: faker.internet.email(),
				cnpj: getNumbersFromString(generateCnpj()),
				accountable: faker.person.fullName(),
			},
			{
				id: 2,
				image: faker.image.avatarGitHub(),
				name: faker.company.name(),
				phone: getNumbersFromString(faker.phone.number()),
				email: faker.internet.email(),
				cnpj: getNumbersFromString(generateCnpj()),
				accountable: faker.person.fullName(),
			},
		],
	});

	const project1 = prisma.project.create({
		data: {
			id: 1,
			idCustomer: 1,
			name: faker.commerce.productName(),
			accountable: faker.person.fullName(),
			description: faker.commerce.productDescription(),
			value: 1_000_000,
			airtableUrl:
				'https://airtable.com/embed/appV1QHqk4si2TYRZ/shrjnLYTTdgWEkqdY?backgroundColor=blue&viewControls=on',
			collaborators: {
				create: [
					{
						name: faker.person.fullName(),
						email: faker.internet.email(),
					},
					{
						name: faker.person.fullName(),
						email: faker.internet.email(),
					},
					{
						name: faker.person.fullName(),
						email: faker.internet.email(),
					},
				],
			},
			status: 'PENDING',
			startDate: new Date(2023, 2, 5).toISOString(),
			endDate: new Date(2023, 11, 18).toISOString(),
			createdAt: new Date(2023, 2, 2).toISOString(),
		},
	});
	const project2 = prisma.project.create({
		data: {
			id: 2,
			idCustomer: 1,
			name: faker.commerce.productName(),
			accountable: faker.person.fullName(),
			description: faker.commerce.productDescription(),
			value: 1_000_000,
			airtableUrl:
				'https://airtable.com/embed/appV1QHqk4si2TYRZ/shrjnLYTTdgWEkqdY?backgroundColor=blue&viewControls=on',
			collaborators: {
				create: [
					{
						name: faker.person.fullName(),
						email: faker.internet.email(),
					},
				],
			},
			status: 'PENDING',
			startDate: new Date().toISOString(),
			endDate: dateAddOrSub(new Date(), { months: 4 }).toISOString(),
			createdAt: new Date().toISOString(),
		},
	});
	const project3 = prisma.project.create({
		data: {
			id: 3,
			idCustomer: 1,
			name: faker.commerce.productName(),
			accountable: faker.person.fullName(),
			description: faker.commerce.productDescription(),
			value: 1_000_000,
			airtableUrl:
				'https://airtable.com/embed/appV1QHqk4si2TYRZ/shrjnLYTTdgWEkqdY?backgroundColor=blue&viewControls=on',
			collaborators: {
				create: [
					{
						name: faker.person.fullName(),
						email: faker.internet.email(),
					},
					{
						name: faker.person.fullName(),
						email: faker.internet.email(),
					},
					{
						name: faker.person.fullName(),
						email: faker.internet.email(),
					},
				],
			},
			status: 'LATE',
			startDate: new Date(2023, 0, 8).toISOString(),
			endDate: new Date(2023, 5, 14).toISOString(),
			createdAt: new Date(2023, 0, 8).toISOString(),
		},
	});
	const project4 = prisma.project.create({
		data: {
			id: 4,
			idCustomer: 1,
			name: faker.commerce.productName(),
			accountable: faker.person.fullName(),
			description: faker.commerce.productDescription(),
			value: 1_000_000,
			airtableUrl:
				'https://airtable.com/embed/appV1QHqk4si2TYRZ/shrjnLYTTdgWEkqdY?backgroundColor=blue&viewControls=on',
			collaborators: {
				create: [
					{
						name: faker.person.fullName(),
						email: faker.internet.email(),
					},
					{
						name: faker.person.fullName(),
						email: faker.internet.email(),
					},
				],
			},
			status: 'FINISHED',
			startDate: new Date(2022, 9, 25).toISOString(),
			endDate: new Date(2023, 5, 10).toISOString(),
			createdAt: new Date(2022, 9, 25).toISOString(),
		},
	});

	const [userRes, customersRes, ...projectsRes] = await prisma.$transaction([
		user,
		customers,
		project1,
		project2,
		project3,
		project4,
	]);
	console.log({ userRes, customersRes, projectsRes });
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
