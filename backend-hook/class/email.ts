import nodemailer from 'nodemailer';
import variables_entorno from '../config';

export class Email {
    host:string = variables_entorno.EMAIL_HOST
    port:number = variables_entorno.EMAIL_PORT
    secure:boolean = false
    tls:boolean = false

    auth = {
        user: variables_entorno.EMAIL_AUTH_USER,
        pass: variables_entorno.EMAIL_AUTH_PASS
    }

    constructor(){

    }

    enviarEmail(cuentaCorreoDesinto:string, asunto:string, cuerpoEmail:string, html:string = "") {


        return new Promise((resolve, reject) => {


            const transporter = nodemailer.createTransport({
                host: this.host,    
                port: this.port,    
                secure: this.secure,
                auth:{    
                    user: this.auth.user,    
                    pass: this.auth.pass    
                },    
                tls:{    
                    rejectUnauthorized: this.tls    
                }               
            })
    
            const mailOptions = {
                from: this.auth.user,
                to: cuentaCorreoDesinto,
                subject: asunto,
                text: cuerpoEmail,
                html: html
            }

            nodemailer.createTestAccount((error) => {
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error){
                        reject(error);
                    }
                    else{
                        return resolve(info)
                    }
                });
            })

        })
    }
}