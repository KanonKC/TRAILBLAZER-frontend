import * as React from "react";
import { BrandLogo } from "trailblazer-ui";

export const Sizes = () => (
  <div className="p-6 grid gap-4">
    <h1 className="text-5xl"><BrandLogo /></h1>
    <h2 className="text-3xl"><BrandLogo /></h2>
    <p className="text-xl"><BrandLogo /></p>
    <p className="text-base"><BrandLogo /></p>
  </div>
);

export const InNavbar = () => (
  <div className="p-6">
    <div className="flex items-center justify-between rounded-lg border px-4 py-3">
      <span className="text-2xl"><BrandLogo /></span>
      <nav className="flex gap-6 text-sm text-muted-foreground"><span>Dashboard</span><span>Widgets</span><span>Pricing</span></nav>
    </div>
  </div>
);
