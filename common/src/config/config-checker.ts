//Check the configuration before start the application

import { ConfigurationError } from "../errors/configuration-error";

export const checkConfig = (keys:string[]) => {
    const errors:{key:string, message:string}[] = [];
    for(const key of keys){
        if(!process.env[key]){
            errors.push({key, message: "key not found"});
        }
    }
    
    if(errors.length > 0){
        throw new ConfigurationError(errors);
    }
}

