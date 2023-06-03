import nodemailer from "nodemailer";

const {USER_MAILER, PASSWORD_MAILER} = process.env;
//integrando
export const sendCodeEmail = async(objEmail)=>{
    console.log('objEmail:..',objEmail);
    let objRes= {
        msg: 'Enviando Email al usuario:..'
    };
    const userNameEmail = objEmail.email.split("@")[0];
  const confirmPage = `
   <h3>Bienvenido ${userNameEmail} tu codigo de acceso es:</h3>
   <h1>${objEmail.code}</h1>
  `;

  try {
    const transporter = nodemailer.createTransport({
        host: "mail.gmx.com",
      port: 587,
      secure: false, 
        auth: {
          user: USER_MAILER,
          pass: PASSWORD_MAILER
        },
      });
  
      let mailOptions = {
        from: USER_MAILER,
        to: objEmail.email,
        subject: `Tu Código de Acceso es: ${objEmail.code}`,
        html: confirmPage,
      };

      //aqui verificamos que el mailerService esta activo
    transporter.verify(function (error, success) {
        if (error) {
          console.log("No responde el mailerService:..", error);
        } else {
          console.log("Server is ready to take our messages:..");
        }
      });

      const result = await transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
           objRes = {
            ...objRes,
            estatus: "Error al enviar email",
            message: error,
          };
          console.log(objRes);
          return objRes
        } else {
          console.log("Email enviado: " + info.response);
          //await addToLoggerNewUserFile(`Result del envio del Código..${result}`);
           objRes = {
            ...objRes,
            estatus: "Email enviado",
            message: info.response,
          };
          console.log(objRes);
        return objRes
        }
      });

      objRes= {
        ...objRes,
        result: result?result:''
      }

    return objRes
  } catch (error) {
    return error
  }

}