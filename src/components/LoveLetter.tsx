import React from 'react';
import { motion } from 'framer-motion';
import { HeartHandshake } from 'lucide-react';

const LoveLetter = () => {
  return (
    <section className="py-8" id="letter">
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-3xl mx-auto"
      >
        <div className="text-center mb-8">
          <HeartHandshake className="h-12 w-12 mx-auto text-red-500 mb-4" />
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-purple-800">
            My Birthday Letter to You 💌
          </h2>
        </div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="bg-white p-8 md:p-10 rounded-xl shadow-lg border border-pink-200"
        >
          <p className="text-lg leading-relaxed mb-6 text-gray-700">
            My dearest Sarah💖,
          </p>
          <p className="text-lg leading-relaxed mb-6 text-gray-700">
            As I write this letter for your birthday 🎂, I find myself marveling at how fortunate I am to have you in my life. Each day with you is a gift 🎁 that I cherish more than you could ever know.
          </p>
          <p className="text-lg leading-relaxed mb-6 text-gray-700">
            Today is not just a celebration of your birth, but a celebration of everything you are - your kindness 🌸, your strength 💪, your beautiful smile 😊 that lights up my world, and the countless ways you make life better just by being you. 
            <br />
            <em className="text-sm text-purple-600 block mt-2">
              “You are altogether beautiful, my darling; there is no flaw in you.” — Song of Solomon 4:7 ✨
            </em>
          </p>
          <p className="text-lg leading-relaxed mb-6 text-gray-700">
            Do you remember when we first met? I knew even then that you were someone special. What I couldn't have known was how deeply you would touch my heart, how completely you would change my life, and how perfectly we would fit together. 
            <br />
            <em className="text-sm text-purple-600 block mt-2">
              “The Lord has done this, and it is marvelous in our eyes.” — Psalm 118:23 🙏
            </em>
          </p>
          <p className="text-lg leading-relaxed mb-6 text-gray-700">
            On your special day, I want you to know that my love for you grows with each passing moment. You are my best friend, my confidant, my partner in all of life's adventures, and the woman I can't wait to build a future with. 🏡💑
            <br />
            <em className="text-sm text-purple-600 block mt-2">
              “Two are better than one… for if they fall, one will lift up the other.” — Ecclesiastes 4:9-10 🤝
            </em>
          </p>
          <p className="text-lg leading-relaxed mb-6 text-gray-700">
            Happy birthday, my love 🎉. May this year bring you all the joy, success, and happiness that you deserve. 
            <br />
            <em className="text-sm text-purple-600 block mt-2">
              “For I know the plans I have for you… plans to prosper you and not to harm you, plans to give you hope and a future.” — Jeremiah 29:11 🌟
            </em>
          </p>
          <p className="text-lg leading-relaxed mb-6 text-gray-700">
            As you journey into this new year of your life, may the words of <strong>Psalm 91</strong> be your covering and your shield:
            <br />
            <em className="text-sm text-purple-700 block mt-3 leading-snug">
              “He who dwells in the secret place of the Most High, shall abide under the shadow of the Almighty.
              I will say of the Lord, ‘He is my refuge and my fortress; My God, in Him I will trust.’”<br />
              — Psalm 91:1–2 🕊️
            </em>
            </p>
          <p className="text-lg leading-relaxed text-gray-700 text-right">
            Forever yours, 💌
          </p>
          <p className="text-xl font-bold mt-2 text-black-700 text-right">
            Jr Patrick 🙇🏽‍♂️
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default LoveLetter;
