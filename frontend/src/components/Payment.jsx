import React, { useState, useEffect } from 'react';
import Card from 'react-credit-cards';
import './PaymentTab.css';
import { CourseData } from '../context/CourseContext';
import { formatCreditCardNumber, formatCVC, formatExpirationDate } from './utils';
import 'react-credit-cards/es/styles-compiled.css';
import { Link, useParams } from 'react-router-dom';
import { UserData } from '../context/UserContext';

const Payment = () => {
    const { id: _id } = useParams();
    const { fetchCourse, course } = CourseData();
    const { user } = UserData();
    const [state, setState] = useState({
        number: '',
        name: '',
        expiry: '',
        cvc: '',
        issuer: '',
        focused: '',
        formData: '',
        token: ''
    });

    const handleCallback = ({ issuer }, isValid) => {
        if (isValid) {
            setState(prevState => ({ ...prevState, issuer }));
        }
    }

    const handleInputFocus = ({ target }) => {
        setState(prevState => ({
            ...prevState,
            focused: target.name
        }));
    }

    const handleInputChange = ({ target }) => {
        if (target.name === 'number') {
            target.value = formatCreditCardNumber(target.value);
        } else if (target.name === 'expiry') {
            target.value = formatExpirationDate(target.value);
        } else if (target.name === 'cvc') {
            target.value = formatCVC(target.value);
        }

        setState(prevState => ({
            ...prevState,
            [target.name]: target.value
        }));
    }

    const handleSubmit = e => {
        e.preventDefault();
        const { issuer } = state;
        const formData = [...e.target.elements]
            .filter(d => d.name)
            .reduce((acc, d) => {
                acc[d.name] = d.value;
                return acc;
            }, {});

        setState(prevState => ({ ...prevState, formData }));
        e.target.reset();
    }

    useEffect(() => {
        fetchCourse(_id);
    }, []);

    const { name, number, expiry, cvc, focused, issuer } = state;

    return (
        <div className='paym bg-gray-100 p-10'>
            <div className='flex justify-between items-start w-full'>
                <div key='Payment' className='flex-1 mr-8'>
                    
                    <div className='App-payment cl-1'>
                        <p className='pPayment'>Enter Credit card details</p>
                        <br />
                        <Card
                            number={number}
                            name={name}
                            expiry={expiry}
                            cvc={cvc}
                            focused={focused}
                            callback={handleCallback}
                        />
                        <form className='credit-form' onSubmit={handleSubmit}>
                            <div className='form-group'>
                                <input
                                    type='tel'
                                    name='number'
                                    className='frm-ctrl'
                                    placeholder='Card Number'
                                    pattern='[\d| ]{16,22}'
                                    required
                                    onChange={handleInputChange}
                                    onFocus={handleInputFocus}
                                />
                            </div>
                            <div className='form-group'>
                                <input
                                    type='text'
                                    name='name'
                                    className='frm-ctrl'
                                    placeholder='Name'
                                    required
                                    onChange={handleInputChange}
                                    onFocus={handleInputFocus}
                                />
                            </div>
                            <div className='form-group'>
                                <input
                                    type='tel'
                                    name='expiry'
                                    className='frm-ctrl'
                                    placeholder='Valid Thru'
                                    pattern='\d\d/\d\d'
                                    required
                                    onChange={handleInputChange}
                                    onFocus={handleInputFocus}
                                />
                            </div>
                            <div className='form-group'>
                                <input
                                    type='tel'
                                    name='cvc'
                                    className='frm-ctrl cvc'
                                    placeholder='CVC'
                                    pattern='\d{3,4}'
                                    required
                                    onChange={handleInputChange}
                                    onFocus={handleInputFocus}
                                />
                            </div>
                            <input type='hidden' name='issuer' value={issuer} />
                            <div>
                                <Link to={`/payment-success/${course?._id}`}>
                                    <button className='common-btn'>Pay Now</button>
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
                
            </div>
        </div>
    );
};

export default Payment;