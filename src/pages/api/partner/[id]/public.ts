import type { NextApiRequest, NextApiResponse } from "next";
import { selectPublicPartnerInfo } from "../../../../../prisma/helpers";
import db from "../../../../../prisma/prisma-client";

export type PublicPartnerRes = Awaited<ReturnType<typeof getPublicPartnerInfo>>;

//console.log("here");

function getPublicPartnerInfo(id: number) {
return db.organization.findUnique({
where: { id },
select: selectPublicPartnerInfo,
});
}

export default async function handler(
req: NextApiRequest,
res: NextApiResponse<PublicPartnerRes | string>
) {
if (!req.query.id || typeof req.query.id !== "string")
return res.status(400).send("Organization ID is required.");

try {
    const id = parseInt(req.query.id);
    const organization = await getPublicPartnerInfo(id);
    console.log(organization);
    if (!organization) return res.status(400).send("Organization not found. ID: " + id);
    
    return res.status(200).send(organization);
} catch (e: any) {
    return res.status(500).send({ ...e, message: e.message }); // prisma error messages are getters
    }
    }