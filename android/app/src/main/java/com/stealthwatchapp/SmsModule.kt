package com.stealthwatchapp

import android.telephony.SmsManager
import android.util.Log
import android.widget.Toast
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class SmsModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    private val context = reactContext

    override fun getName(): String {
        return "SmsModule"
    }

    @ReactMethod
    fun sendSMS(phoneNumber: String, message: String) {
        try {
            Log.d("SmsModule", "📤 Sending SMS to $phoneNumber")
            Log.d("SmsModule", "📨 Message content: $message")

            val smsManager = SmsManager.getDefault()
            smsManager.sendTextMessage(phoneNumber, null, message, null, null)

            Log.d("SmsModule", "✅ SMS sent successfully to $phoneNumber")
            Toast.makeText(context, "✅ SMS sent to $phoneNumber", Toast.LENGTH_LONG).show()
        } catch (e: Exception) {
            Log.e("SmsModule", "❌ Failed to send SMS", e)
            Toast.makeText(context, "❌ SMS failed: ${e.message}", Toast.LENGTH_LONG).show()
        }
    }
}
