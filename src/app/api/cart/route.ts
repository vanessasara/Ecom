import { NextRequest, NextResponse } from "next/server";
import { db, cartTable } from "@/lib/drizzle";
import { v4 as uuidv4 } from 'uuid';
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";

export const GET = async (request: NextRequest) => {
    try {
        const res = await db.select().from(cartTable);
        return NextResponse.json({ res });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Something bad has happened" });
    }
};

export const POST = async (request: NextRequest) => {
    const req = await request.json();
    const list = cookies();
    let userId = list.get("user_id")?.value;

    if (!userId) {
        userId = uuidv4();
        list.set("user_id", userId, { path: '/' });
    }

    try {
        const res = await db.insert(cartTable).values({
            product_id: req.product_id,
            quantity: 1,
            user_id: userId
        }).returning();
        return NextResponse.json({ res });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Something bad has happened" });
    }
};

export const DELETE = async (request: NextRequest) => {
    try {
        const { id } = await request.json();

        if (id) {
            await db.delete(cartTable).where(eq(cartTable.id, id));
            return NextResponse.json({ message: 'Data deleted successfully' });
        } else {
            throw new Error('ID field is required');
        }
    } catch (error) {
        return NextResponse.json({ message: (error as { message: string }).message });
    }
};
