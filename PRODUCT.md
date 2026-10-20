# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

A real Indian jewellery brand serves three groups of customers. None of them dominates, so every customer-facing surface has to work for all three:

- **Bridal families** planning a wedding. They research high-value sets online before visiting the showroom in person.
- **Local repeat buyers**, who already know the showroom. They check today's metal rates and buy gifts or daily wear online.
- **Online-first shoppers** across India who find the brand online and buy smaller pieces for delivery.

**Store staff (admins)** run the catalogue, metal rates, orders, appointments, coupons, banners and reviews from the admin panel.

## Product Purpose

Baikunthh Jewellers' own storefront, built so customers can browse the catalogue, see current prices, buy online with cash on delivery, and book showroom consultations. Success means online orders and booked showroom appointments.

## Positioning

**Undecided.** The owner hasn't chosen what sets the store apart from national chains such as Tanishq or CaratLane. The candidates raised so far:

- transparent rate-based pricing with a full breakdown
- leading customers to the in-person showroom relationship
- heritage Indian craft

Don't pick one in design work without confirming it with the owner first.

## Operating Context

- **Prices change daily.** Most products are rate-based: net weight × the current rate for that metal and purity, plus making charge and stone charge. Staff update the gold, silver and platinum rates by purity. A few products have a fixed price instead.
- **Tax and currency:** prices include GST (3% by default, configurable in Settings) and are shown in INR (`Rs.` with Indian digit grouping).
- **Payment:** cash on delivery only. There is no payment gateway yet.
- **Appointments:** customers can book showroom visits of three types: Bridal, Custom design and Shopping.
- **Catalogue vocabulary:**
  - Categories: Rings, Necklaces, Bangles, Earrings, Pendants.
  - Collections: Bridal Edit, Daily Luxury, Heirloom Classics.
  - Purity labels: 24K, 22K, 18K and 925 silver.
  - Product names: traditional Indian forms such as temple choker, polki kundan haar, jhumka, kada.

## Capabilities and Constraints

**Customers can:**
- browse the shop with filters for category, collection, metal and purity
- open a product page with a price breakdown and reviews
- use a cart and wishlist (stored in the browser)
- check out with a saved address and a coupon
- view their account and order history
- book an appointment

**Staff can:**
- manage the full catalogue and stock
- update metal rates
- change order and payment status, and add tracking details
- run banners, coupons and articles
- moderate reviews
- edit store settings, including the hero text and announcement bar

**Constraints:**
- Product images are URLs. There is no upload system.
- The Journal/articles page and the About page are placeholders.
- There are no email notifications.
- There is no product pagination.

## Brand Commitments

- **Name:** Baikunthh Jewellers (spelt with a double "h").
- **Brand line already on the site:** "Timeless Jewellery. Extraordinary Moments."
- **Contact:** care@baikunthh.com, +91 7068580500 (also on WhatsApp), Instagram @devanshabhushan.

## Evidence on Hand

The owner has confirmed these claims are true and may be shown as proof:

- Authorized Hallmark Centre
- Lifetime Buyback Guarantee
- Complimentary insured shipping on all bridal collections

Real content: the store settings and about-us text, plus the product, category and collection data in `backend/prisma/seed.ts`.

**Not on hand:** real customer testimonials, press coverage, a founding year or a showroom street address. The seeded address is generic, and product imagery is external URLs. Don't invent any of these.

## Product Principles

1. **Show prices honestly.** Prices move with metal rates, so show what a piece costs today and how that number is made up.
2. **Serve both ways of buying.** A family planning a bridal visit and a shopper buying a pendant for delivery are equally important. Neither path should feel secondary.
3. **Earn trust before asking for money.** Feature the confirmed trust claims (hallmarking, buyback, insured shipping) where customers are about to commit to a high-value purchase.
4. **Respect the craft vocabulary.** Use the traditional names for forms and the purity terms Indian buyers expect. Don't flatten them into generic Western jewellery terms.
