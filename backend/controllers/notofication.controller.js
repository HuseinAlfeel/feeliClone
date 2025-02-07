import Notification from '../models/notification.model.js';


export const getNotifications = async (req,res) =>{


    try {
        const userId = req.user._id;
        
        const notification = await Notification.find({ to:userId}).populate({
            path: "from", // we use the "from" to get the username instead of the ID which is a weird number :)
            select: "username profileImg",
        });

        await Notification.updateMany({to:userId}, {read:true});
        res.status(200).json(notification);
        
    } catch (error) {
        console.log("Error in the getNotifications controller", error);
        res.status(500).json({error: "Internal server error"});
        
    }
}
export const deleteNotifications = async (req,res) =>{


    try {
        const userId = req.user._id;

        await Notification.deleteMany({to:userId});
        
        res.status(200).json({message: "Notifications deleted successfully"});

        
    } catch (error) {
        console.log("Error in the deleteNotifications controller", error);
        res.status(500).json({error: "Internal server error"});
    }
}

export const deleteNotification = async(req,res) =>{

    try {
        const notificationId = req.params.id;
        userId = req.user._id;
        const notification = await Notification.findById(notificationId);
        if(!notification){
            return res.status(404).json({error: "Notification not found"});
        }
        if(notification.to.toString() !== userId.toString()){
            return res.status(403).json({error: "You are not authrized to delete this notification"});
        }

        await Notification.findByIdAndDelete(notificationId);
        res.status(200).json({message: "Notification deleted successfully"});
    } catch (error) {
        console.log("Error in the deleteNotification controller: ", error );
        res.status(500).json({error: "Internal server error"});
    }
}