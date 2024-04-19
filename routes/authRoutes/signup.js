import CustomerModel from '../../model/customer.js';

const Signup = async (req, res) => {
    // console.log(req.body);
    // try{

    // } catch (err) {

    // }


    CustomerModel.create(req.body)
        .then(user => {
            res.json(user)
        })
        .catch(err => res.json(err))
};

export default Signup;