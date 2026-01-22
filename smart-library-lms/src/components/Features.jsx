// components/Features.jsx
import React from 'react';
import {
  QrCodeIcon,
  BanknotesIcon,
  ClockIcon,
  UserGroupIcon,
  ComputerDesktopIcon,
  StarIcon
} from '@heroicons/react/24/outline';

const Features = () => {
  const features = [
    {
      icon: QrCodeIcon,
      title: 'QR Code Transactions',
      description: 'Scan QR codes for instant book issue and return operations',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: BanknotesIcon,
      title: 'Automated Fine Calculation',
      description: 'Automatic fine calculation for overdue books with real-time notifications',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      icon: ClockIcon,
      title: 'Real-time Tracking',
      description: 'Monitor book availability and member activities in real-time',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      icon: UserGroupIcon,
      title: 'Dual User Roles',
      description: 'Separate dashboards for administrators and library members',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      icon: ComputerDesktopIcon,
      title: 'Digital Catalog',
      description: 'Complete digital catalog with advanced search and filtering options',
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50'
    },
    {
      icon: StarIcon,
      title: 'Book Reviews & Ratings',
      description: 'Members can rate books and write reviews for better recommendations',
      color: 'text-pink-600',
      bgColor: 'bg-pink-50'
    }
  ];

  return (
    <section id="features" className="container mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Smart Features for Modern Libraries
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          Automating traditional library operations with cutting-edge technology
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100 h-full flex flex-col"
          >
            <div className={`${feature.bgColor} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
              <feature.icon className={`h-6 w-6 ${feature.color}`} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
            <p className="text-gray-600 flex-grow">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;