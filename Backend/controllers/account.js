exports.postEditAccount = async (req, res) =>{
    try {
        const userId= req.user.userId;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).send({message: 'User not found'});
        }

    }catch (e){
        console.error('Error Editing Account Details:', e.message);
        res.status(500).json({ message: 'Error Editing Account Details' });
    }

}