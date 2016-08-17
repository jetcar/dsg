using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.IO;
using System.Net.Mail;
using System.Threading.Tasks;

namespace WebApplication1.Services
{
    public class MyEmailService
    {

        public Func<SmtpClient> CreateSmtpClient;



        public MyEmailService()
        {
            CreateSmtpClient = CreateSmtpClientMethod ;
        }

        public async Task SendEmailAsync(string subject, string to, string body, string bcc = "")
        {
            using (var smtpClient = CreateSmtpClient())
            {
                var mailMessage = CreateMailMessage(subject, to, body, bcc);

                smtpClient.SendCompleted += (sender, args) => { SendCompleted(args, mailMessage); };
                await smtpClient.SendMailAsync(mailMessage);
            }
        }

        private static void SendCompleted(AsyncCompletedEventArgs args, MailMessage mailMessage)
        {
            if (args.Cancelled)
            {
                //Logger.Error("Cancelled sending async e-mail to " + mailMessage.To);
            }
            else if (args.Error != null)
            {
                //Logger.Error("Error sending async e-mail to " + mailMessage.To);
            }
            else
            {
                //Logger.Debug("Async e-mail successfully sent to " + mailMessage.To);
            }
            mailMessage.Dispose();
        }

        public async Task SendEmailAsync(string subject, string to, string body, IList<byte[]> attachments,
            IList<string> attachmentNames)
        {
            using (var smtpClient = CreateSmtpClient())
            {
                var mailMessage = CreateMailMessage(subject, to, body);

                for (int i = 0; i < attachments.Count; i++)
                {
                    var attachment = attachments[i];
                    var ms = new MemoryStream(attachment);

                    if (attachment != null)
                    {
                        System.Net.Mime.ContentType contentType = new System.Net.Mime.ContentType();
                        contentType.MediaType = System.Net.Mime.MediaTypeNames.Application.Pdf;
                        contentType.Name = attachmentNames[i];
                        mailMessage.Attachments.Add(new Attachment(ms, contentType));
                    }
                }
                smtpClient.SendCompleted += (sender, args) => { SendCompleted(args, mailMessage); };

                await smtpClient.SendMailAsync(mailMessage);
            }
        }

        public async Task SendEmailAsync(string subject, string to, string body, byte[] attachment, string attachmentName)
        {
            await SendEmailAsync(subject, to, body, new List<byte[]> { attachment }, new List<string> { attachmentName });
        }


        private SmtpClient CreateSmtpClientMethod()
        {
            return new SmtpClient
            {
                DeliveryMethod = SmtpDeliveryMethod.Network,
                Host = "localhost",
                Port = 25
            };
        }

        private MailMessage CreateMailMessage(string subject, string to, string body, string bcc = "")
        {
            var message = new MailMessage
            {
                From = new MailAddress("ds@sdg.ee", "name"),
                Subject = subject,
                Body = body,
                IsBodyHtml = true
            };
            if (!string.IsNullOrEmpty(to))
            {
                foreach (var mail in to.Split(','))
                {
                    message.To.Add(mail);
                }
            }
            if (!string.IsNullOrEmpty(bcc))
            {
                foreach (var mail in bcc.Split(','))
                {
                    message.Bcc.Add(mail);
                }
            }



            return message;
        }
    }
}
