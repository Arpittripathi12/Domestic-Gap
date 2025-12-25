const AlertBox=()=>{
 return <>
 <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed top-5 right-5 z-50 w-72 rounded-xl bg-white shadow-xl border overflow-hidden"
    >
      {/* 🔴 Red Countdown Line */}
      <motion.div
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }}
        transition={{ duration, ease: "linear" }}
        style={{ originX: 1 }} // right → left
        className="h-1 bg-red-600"
      />

      {/* Content */}
      <div className="p-4 flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-gray-800">Logging out</h3>
          <p className="text-sm text-gray-500">
            You will be logged out automatically
          </p>
        </div>

        {/* ❌ Close Button */}
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-red-500 transition"
        >
          <X size={18} />
        </button>
      </div>
    </motion.div>
 </>
}
export default AlertBox;