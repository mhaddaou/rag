import bcrypt


async def incrypt_password(password : str):
    bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hash = bcrypt.hashpw(bytes, salt)
    return hash.decode('utf-8')

def decrypt_password(encrypted_pass : str, userPassword : str):
    return  bcrypt.checkpw(password=userPassword.encode(), hashed_password=encrypted_pass.encode())