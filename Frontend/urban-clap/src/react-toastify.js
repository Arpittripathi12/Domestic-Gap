import {toast} from "react-toastify";

export const showsuccess=(msg)=>{
    toast.success(msg,{
        theme:"colored"
    });
};
export const showerror=(msg)=>{
    toast.error(msg,{
        theme:"colored"
    });
};
export const showinfo=(msg)=>{
    toast.info(msg,{
        theme:"colored"
    });
};

export const showwarning=(msg)=>{
    toast.warning(msg,{
        theme:"colored"
    });
};