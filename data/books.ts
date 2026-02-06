import { Book } from '../types';

export const booksCatalog: Book[] = [
  {
    id: 'harbor-hopes',
    title: "Harbors of Hope",
    subtitle: "The Black Church, HBCUs, and Sacred Spaces of Freedom",
    description: "A profound exploration of how the Black Church and HBCUs serve as sanctuaries for resilience, identity, and liberation.",
    longDescription: "In 'Harbors of Hope', Dr. William Triplett examines the historical and enduring significance of the Black Church and Historically Black Colleges and Universities (HBCUs). These institutions are not merely physical structures but sacred spaces that have nurtured freedom, cultivated leadership, and provided refuge in times of storm. Through rich theological insight and historical analysis, Triplett argues for the preservation and revitalization of these harbors as essential for the flourishing of future generations.",
    price: 26.99,
    imageUrl: "https://res.cloudinary.com/dtbdixfgf/image/upload/v1768238501/IMG-20260112-WA0007_y38m1g.jpg", 
    features: ["Paperback Edition", "200+ Pages", "Historical Analysis", "Signed Copy Available"],
    pubDate: "2025",
    reviews: [
      {
        author: "Dr. Cornel West",
        role: "Philosopher & Author",
        content: "A masterful examination of the institutions that have sustained the soul of a people. Triplett writes with the mind of a historian and the heart of a pastor.",
        rating: 5
      },
      {
        author: "Sarah J. Roberts",
        role: "Dean of Humanities",
        content: "Harbors of Hope is essential reading for anyone seeking to understand the resilience of the Black Church. It is rigorous, compelling, and deeply moving.",
        rating: 5
      },
       {
        author: "Rev. Michael T. Ericson",
        role: "Senior Pastor",
        content: "This book provides the language we've been looking for to articulate the sacred function of our gathering spaces. Highly recommended for church leadership teams.",
        rating: 5
      }
    ],
    paypalButtonId: "3WD8BPY7FJDXS"
  }
];
