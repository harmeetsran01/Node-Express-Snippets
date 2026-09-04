export const loginUser = async(req,res) =>{
    try {
        return res.status(200).json({
            message:"Had hit the endpoint"           
        })
    } catch (error) {
        return res.status(500).json({
            message:"The internal server error "
        })
    }
}