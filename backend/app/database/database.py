from prisma import Prisma

# Create a single instance of Prisma client
db = Prisma()

async def connect_db():
    """Connect to the database"""
    print("Connecting to DB...")
    await db.connect()

async def disconnect_db():
    """Disconnect from the database"""
    print("Disconnecting from DB...")
    await db.disconnect()