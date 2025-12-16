# Render Environment Variables Setup

## Required Environment Variables

Add these environment variables in your Render dashboard under **Environment** section:

### 1. MONGODB_URI
- **Description**: MongoDB connection string
- **Example**: `mongodb+srv://username:password@cluster.mongodb.net/school?retryWrites=true&w=majority`
- **Required**: Yes
- **How to get**: 
  - If using MongoDB Atlas: Copy the connection string from your cluster
  - If using another MongoDB service: Use your provider's connection string
  - Format: `mongodb://[username:password@]host[:port][/database]`

### 2. JWT_SECRET
- **Description**: Secret key for signing and verifying JWT tokens
- **Example**: `your_super_secret_jwt_key_here_make_it_long_and_random`
- **Required**: Yes
- **How to generate**: 
  - Use a long random string (at least 32 characters)
  - You can generate one using: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
  - Or use an online generator

### 3. NODE_ENV (Optional but Recommended)
- **Description**: Node.js environment
- **Value**: `production`
- **Required**: No (but recommended for production)
- **Note**: Render may set this automatically, but you can explicitly set it

### 4. PORT (Optional)
- **Description**: Server port number
- **Value**: Usually set automatically by Render
- **Required**: No
- **Note**: Render automatically assigns a PORT, so you typically don't need to set this

## How to Add Environment Variables in Render

1. Go to your Render dashboard
2. Select your service (the school portal service)
3. Click on **Environment** in the left sidebar
4. Click **Add Environment Variable**
5. Add each variable:
   - **Key**: The variable name (e.g., `MONGODB_URI`)
   - **Value**: The actual value (e.g., your MongoDB connection string)
6. Click **Save Changes**
7. Render will automatically redeploy your service

## Important Notes

- **Never commit `.env` files to Git** - Environment variables should only be set in Render
- **Keep JWT_SECRET secure** - Don't share it publicly
- **MongoDB URI should include credentials** - Make sure your MongoDB user has proper permissions
- After adding environment variables, Render will automatically redeploy your service

## Example Environment Variables

```
MONGODB_URI=mongodb+srv://admin:password123@cluster0.xxxxx.mongodb.net/school?retryWrites=true&w=majority
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
NODE_ENV=production
```

## Verification

After adding the environment variables:
1. Check the Render logs to ensure MongoDB connects successfully
2. Try accessing your application
3. Test admin registration/login to verify JWT is working

