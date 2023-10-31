"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const string_helper_1 = require("../src/utils/string-helper");
const date_helpers_1 = require("../src/utils/date-helpers");
const faker_1 = require("@faker-js/faker");
const cnpj_1 = require("../src/lib/cnpj");
const prisma = new client_1.PrismaClient();
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
                image: faker_1.fakerPT_BR.image.avatarGitHub(),
                name: faker_1.fakerPT_BR.company.name(),
                phone: (0, string_helper_1.getNumbersFromString)(faker_1.fakerPT_BR.phone.number()),
                email: faker_1.fakerPT_BR.internet.email().toLocaleLowerCase(),
                cnpj: (0, string_helper_1.getNumbersFromString)((0, cnpj_1.generate)()),
                accountable: faker_1.fakerPT_BR.person.fullName(),
            },
            {
                id: 2,
                image: faker_1.fakerPT_BR.image.avatarGitHub(),
                name: faker_1.fakerPT_BR.company.name(),
                phone: (0, string_helper_1.getNumbersFromString)(faker_1.fakerPT_BR.phone.number()),
                email: faker_1.fakerPT_BR.internet.email().toLocaleLowerCase(),
                cnpj: (0, string_helper_1.getNumbersFromString)((0, cnpj_1.generate)()),
                accountable: faker_1.fakerPT_BR.person.fullName(),
            },
        ],
    });
    const project1 = prisma.project.create({
        data: {
            id: 1,
            idCustomer: 1,
            name: faker_1.fakerPT_BR.commerce.productName(),
            accountable: faker_1.fakerPT_BR.person.fullName(),
            description: faker_1.fakerPT_BR.commerce.productDescription(),
            value: 1000000,
            airtableIframeUrl: 'https://airtable.com/embed/appV1QHqk4si2TYRZ/shrjnLYTTdgWEkqdY?backgroundColor=blue&viewControls=on',
            airtableUrl: 'https://airtable.com/app8EElQ3WwjcyXxL/tbliB0HhLfrHxZCuk/viwjfsVo0B79RF1ev?blocks=hide',
            collaborators: {
                create: [
                    {
                        name: faker_1.fakerPT_BR.person.fullName(),
                        email: faker_1.fakerPT_BR.internet.email().toLocaleLowerCase(),
                    },
                    {
                        name: faker_1.fakerPT_BR.person.fullName(),
                        email: faker_1.fakerPT_BR.internet.email().toLocaleLowerCase(),
                    },
                    {
                        name: faker_1.fakerPT_BR.person.fullName(),
                        email: faker_1.fakerPT_BR.internet.email().toLocaleLowerCase(),
                    },
                ],
            },
            driveFolderId: '1jEeUHfXIziC99Q-jTWv-p3IFenauMRfz',
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
            name: faker_1.fakerPT_BR.commerce.productName(),
            accountable: faker_1.fakerPT_BR.person.fullName(),
            description: faker_1.fakerPT_BR.commerce.productDescription(),
            value: 1000000,
            airtableIframeUrl: 'https://airtable.com/embed/appV1QHqk4si2TYRZ/shrjnLYTTdgWEkqdY?backgroundColor=blue&viewControls=on',
            airtableUrl: 'https://airtable.com/app8EElQ3WwjcyXxL/tbliB0HhLfrHxZCuk/viwjfsVo0B79RF1ev?blocks=hide',
            collaborators: {
                create: [
                    {
                        name: faker_1.fakerPT_BR.person.fullName(),
                        email: faker_1.fakerPT_BR.internet.email().toLocaleLowerCase(),
                    },
                ],
            },
            driveFolderId: '1jEeUHfXIziC99Q-jTWv-p3IFenauMRfz',
            status: 'PENDING',
            startDate: new Date().toISOString(),
            endDate: (0, date_helpers_1.dateAddOrSub)(new Date(), { months: 4 }).toISOString(),
            createdAt: new Date().toISOString(),
        },
    });
    const project3 = prisma.project.create({
        data: {
            id: 3,
            idCustomer: 1,
            name: faker_1.fakerPT_BR.commerce.productName(),
            accountable: faker_1.fakerPT_BR.person.fullName(),
            description: faker_1.fakerPT_BR.commerce.productDescription(),
            value: 1000000,
            airtableIframeUrl: 'https://airtable.com/embed/appV1QHqk4si2TYRZ/shrjnLYTTdgWEkqdY?backgroundColor=blue&viewControls=on',
            airtableUrl: 'https://airtable.com/app8EElQ3WwjcyXxL/tbliB0HhLfrHxZCuk/viwjfsVo0B79RF1ev?blocks=hide',
            collaborators: {
                create: [
                    {
                        name: faker_1.fakerPT_BR.person.fullName(),
                        email: faker_1.fakerPT_BR.internet.email().toLocaleLowerCase(),
                    },
                    {
                        name: faker_1.fakerPT_BR.person.fullName(),
                        email: faker_1.fakerPT_BR.internet.email().toLocaleLowerCase(),
                    },
                    {
                        name: faker_1.fakerPT_BR.person.fullName(),
                        email: faker_1.fakerPT_BR.internet.email().toLocaleLowerCase(),
                    },
                ],
            },
            driveFolderId: '1jEeUHfXIziC99Q-jTWv-p3IFenauMRfz',
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
            name: faker_1.fakerPT_BR.commerce.productName(),
            accountable: faker_1.fakerPT_BR.person.fullName(),
            description: faker_1.fakerPT_BR.commerce.productDescription(),
            value: 1000000,
            airtableIframeUrl: 'https://airtable.com/embed/appV1QHqk4si2TYRZ/shrjnLYTTdgWEkqdY?backgroundColor=blue&viewControls=on',
            airtableUrl: 'https://airtable.com/app8EElQ3WwjcyXxL/tbliB0HhLfrHxZCuk/viwjfsVo0B79RF1ev?blocks=hide',
            collaborators: {
                create: [
                    {
                        name: faker_1.fakerPT_BR.person.fullName(),
                        email: faker_1.fakerPT_BR.internet.email().toLocaleLowerCase(),
                    },
                    {
                        name: faker_1.fakerPT_BR.person.fullName(),
                        email: faker_1.fakerPT_BR.internet.email().toLocaleLowerCase(),
                    },
                ],
            },
            driveFolderId: '1jEeUHfXIziC99Q-jTWv-p3IFenauMRfz',
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
    .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
});
//# sourceMappingURL=seed.js.map