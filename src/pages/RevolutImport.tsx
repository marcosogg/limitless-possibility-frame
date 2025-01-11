import React from 'react';
import { RevolutImport as RevolutImportComponent } from '../components/revolut/RevolutImport';

export default function RevolutImport() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Import Revolut Transactions</h1>
      <RevolutImportComponent />
    </div>
  );
}