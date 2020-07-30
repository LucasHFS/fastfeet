import Mail from '../../lib/Mail';

class CancellationMail {
  get key() {
    return 'CancellationMail';
  }

  async handle({ data }) {
    const { deliveryman, recipient, product } = data;
    console.log('a fila executou');
    await Mail.sendMail({
      to: 'me@test.com',
      subject: 'One order was cancelled',
      template: 'cancellationMail',
      context: {
        deliveryman: deliveryman.name,
        recipient: recipient.name,
        product,
      },
    });
  }
}
export default new CancellationMail();
