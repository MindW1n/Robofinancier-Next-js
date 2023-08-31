export const fadeInOut = {

    initial: { scale: .4, opacity: 0 },
    animate: { 
        
        scale: 1, 
        opacity: 1,
        transition: {

            duration: .3, 
            ease: "easeOut"
        }
    },
    exit: { 
        
        scale: .6, 
        opacity: 0,
        transition: {

            duration: .3, 
            ease: "easeOut"
        } 
    }
}

export const changeOpacity = {

    initial: { opacity: 0 },
    animate: { 
        
        opacity: 1, 
        transition: { 
            
            duration: .3,
            ease: "easeOut"
        } 
    },
    exit: { 
        
        opacity: 0, 
        transition: { 
            
            duration: .3,
            ease: "easeOut"
        } 
    }
}
