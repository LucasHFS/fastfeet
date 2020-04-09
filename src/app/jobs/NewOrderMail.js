import Mail from '../../lib/Mail';

class NewOrderMail {
  get key() {
    return 'NewOrderMail';
  }

  async handle({ data }) {
    const { deliveryman, recipient, product } = data;
    console.log('a fila executou');
    await Mail.sendMail({
      to: 'me@test.com',
      subject: 'Teste-1',
      template: 'newOrder',
      context: {
        deliveryman: deliveryman.name,
        recipient: recipient.name,
        product,
      },
    });
  }
}
export default new NewOrderMail();
