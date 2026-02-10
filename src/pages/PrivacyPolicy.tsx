import React from 'react';
import { MainLayout } from '../layouts/MainLayout';

export const PrivacyPolicy: React.FC = () => {
    return (
        <MainLayout>
            <div className="max-w-3xl mx-auto px-6 py-20">
                <h1 className="text-3xl font-light mb-12">Privacy Policy</h1>

                <div className="space-y-8 text-sm text-gray-600 leading-relaxed">
                    <section>
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Collecting and Using Your Personal Data</h2>
                        <h3 className="font-bold mb-2">Personal Data</h3>
                        <p className="mb-4">
                            While using Our Service, We may ask You to provide Us with certain personally identifiable information that can be used to contact or identify You. Personally identifiable information may include, but is not limited to:
                        </p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Usage Data</li>
                        </ul>
                    </section>

                    <section>
                        <h3 className="font-bold mb-2">Usage Data</h3>
                        <p className="mb-4">
                            Usage Data is collected automatically when using the Service.<br />
                            Usage Data may include information such as Your Device's Internet Protocol address (e.g. IP address), browser type, browser version, the pages of our Service that You visit, the time and date of Your visit, the time spent on those pages, unique device identifiers and other diagnostic data.
                        </p>
                    </section>

                    <section className="pt-8 border-t border-gray-100">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Personal Information Destruction Policy</h2>
                        <p className="mb-4">
                            발광다이오드.Led (hereinafter referred to as the 'Company'), as a general rule, destroys personal information without delay once the purpose of its collection and use has been achieved. The destruction procedure and method are as follows.
                        </p>

                        <h3 className="font-bold mt-4 mb-2">Article 1 (Destruction Procedure)</h3>
                        <p className="mb-4">
                            The information you enter for membership registration, etc., is transferred to a separate database (or a separate filing cabinet in the case of paper) after the purpose has been achieved. It is stored for a certain period according to internal policies and other relevant laws for information protection reasons (refer to the retention and use period) before being destroyed.
                        </p>

                        <h3 className="font-bold mt-4 mb-2">Article 2 (Destruction Method)</h3>
                        <ol className="list-decimal pl-5 space-y-2">
                            <li><strong>Electronic File Format:</strong> Deleted using a technical method that makes the records unrecoverable.</li>
                            <li><strong>Paper Documents:</strong> Destroyed by shredding or incineration.</li>
                        </ol>

                        <h3 className="font-bold mt-4 mb-2">Article 3 (Information Retention according to Laws)</h3>
                        <div className="bg-gray-50 p-4 rounded text-xs space-y-3 mt-2">
                            <div>
                                <strong>Records on contracts or withdrawal of offers, etc.</strong><br />
                                Reason: Act on Consumer Protection in Electronic Commerce, etc.<br />
                                Retention period: 5 years
                            </div>
                            <div>
                                <strong>Records on payment and supply of goods, etc.</strong><br />
                                Reason: Act on Consumer Protection in Electronic Commerce, etc.<br />
                                Retention period: 5 years
                            </div>
                            <div>
                                <strong>Records on consumer complaints or dispute resolution</strong><br />
                                Reason: Act on Consumer Protection in Electronic Commerce, etc.<br />
                                Retention period: 3 years
                            </div>
                            <div>
                                <strong>Records of website visits</strong><br />
                                Reason: Communication Secrets Protection Act<br />
                                Retention period: 3 months
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </MainLayout>
    );
};
