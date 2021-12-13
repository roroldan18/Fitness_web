import express from 'express';
import variables_entorno from '../config';

class Server {
    public app : express.Application;
    public host : string = variables_entorno.HOST;
    public puerto : number = variables_entorno.PORT;

    constructor(){
        this.app = express();
    }

    start (callback:any){
        this.app.listen(this.puerto, this.host, callback);
    }

}

export default Server;